import type { ApiQuery, ApiRequest } from './request'

/**
 * Ожидание окна лимита API.
 *
 * Laravel режет запросы по IP (`429` + `Retry-After`, лимит стенда — 120 запросов в минуту),
 * а пререндер статики обходит сотни страниц: без ожидания сборка получит 429 на всех
 * детальных страницах и упадёт. Пауза общая на процесс — иначе параллельные запросы
 * снова сожгут лимит.
 */

/** Пауза по умолчанию, если `Retry-After` не пришёл. */
const DEFAULT_WAIT_MS = 5_000

/** Потолок паузы: защита от зависшей сборки. */
const MAX_WAIT_MS = 90_000

/** Дополнительная пауза поверх `Retry-After`, чтобы окно лимита успело открыться. */
const WAIT_MARGIN_MS = 250

export type ThrottleOptions = {
  /** Всего попыток на запрос, включая первую. */
  maxAttempts?: number
}

/** Момент, до которого запросы ждут: общий для процесса. */
let resumeAt = 0

/** Продлевает окно лимита, не сокращая уже открытое. */
function openWindow(waitMs: number): void {
  resumeAt = Math.max(resumeAt, Date.now() + waitMs)
}

type HttpErrorResponse = {
  status?: unknown
  headers?: { get?: (name: string) => string | null }
}

function readResponse(error: unknown): HttpErrorResponse | null {
  if (typeof error !== 'object' || error === null) return null

  const response = (error as { response?: unknown }).response

  return typeof response === 'object' && response !== null ? (response as HttpErrorResponse) : null
}

/**
 * Сколько ждать перед повтором по ошибке запроса;
 * `null` — ошибка не про лимит, повторять не нужно.
 */
export function throttleWaitMs(error: unknown): number | null {
  const response = readResponse(error)

  if (response?.status !== 429) return null

  const header = response.headers?.get?.('retry-after') ?? null
  const seconds = header === null ? Number.NaN : Number(header)

  if (!Number.isFinite(seconds) || seconds < 0) return DEFAULT_WAIT_MS

  return Math.min(seconds * 1000 + WAIT_MARGIN_MS, MAX_WAIT_MS)
}

/**
 * Запрос с ожиданием окна лимита API: повторяет 429 после конца окна.
 * Ошибки любого другого вида и исчерпанные попытки уходят вызывающему как есть.
 *
 * Обёртка для чтения: повтор записи продублировал бы заявку, поэтому мутации идут
 * отдельным транспортом без ожидания окна (`apiWriteFetch` / `useApiMutation`).
 */
export function withThrottleRetry(request: ApiRequest, options: ThrottleOptions = {}): ApiRequest {
  const maxAttempts = options.maxAttempts ?? 4

  return async <Dto>(path: string, requestOptions?: { query?: ApiQuery }) => {
    for (let attempt = 1; ; attempt++) {
      const wait = resumeAt - Date.now()

      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))

      try {
        return await request<Dto>(path, requestOptions)
      } catch (error) {
        const waitMs = throttleWaitMs(error)

        if (waitMs === null || attempt >= maxAttempts) throw error

        openWindow(waitMs)
      }
    }
  }
}
