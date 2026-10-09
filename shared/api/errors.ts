/**
 * Ошибки контракта ручек. Один и тот же код понимают оба транспорта:
 * Nitro-прокси (`/api/*`, когда `public.apiBase` пуст) и клиент, который ходит
 * в Laravel напрямую (когда `public.apiBase` — абсолютный URL).
 */

/**
 * Нарушение контракта ручки: неизвестный параметр, невалидное тело ответа.
 * Сервер превращает её в `createError`, клиент — в ошибку запроса.
 */
export class ApiContractError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'ApiContractError'
    this.statusCode = statusCode
  }
}

/** Тело ответа не прошло проверку формы: наружу — 502, а не мусор из API. */
export function invalidPayload(label: string): ApiContractError {
  return new ApiContractError(502, `${label} API payload is invalid`)
}

/** Опознаёт ошибку контракта среди прочих. */
export function isApiContractError(error: unknown): error is ApiContractError {
  return error instanceof ApiContractError
}

/**
 * Статус и текст для Nuxt-ошибки: так сбой прямого запроса неотличим от ответа прокси,
 * и composables проверяют `statusCode` (например, 404 у несуществующей детальной).
 */
export function apiErrorInfo(error: unknown): { statusCode: number; statusMessage: string } {
  const statusCode = isApiContractError(error) ? error.statusCode : apiErrorStatus(error)
  const statusMessage =
    error instanceof Error && error.message ? error.message : 'API request failed'

  return { statusCode, statusMessage }
}

/**
 * Статус ошибки из h3-ошибки, ofetch-ошибки или обычного `Error`.
 * Неизвестное считаем шлюзовой ошибкой 502: наружу отдаём статус без тела upstream.
 */
export function apiErrorStatus(error: unknown): number {
  if (typeof error !== 'object' || error === null) return 502

  const record = error as { statusCode?: unknown; status?: unknown; response?: unknown }
  const response = record.response
  const responseStatus =
    typeof response === 'object' && response !== null
      ? (response as { status?: unknown }).status
      : undefined
  const status = record.statusCode ?? record.status ?? responseStatus

  if (typeof status === 'number' && status >= 400 && status <= 599) return status

  return 502
}
