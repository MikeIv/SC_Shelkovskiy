import { isError } from 'h3'
import type { H3Event } from 'h3'
import type { ApiEnvelope } from '#shared/types/api'

export type ApiProxyOptions<Dto, Data> = {
  /** Имя обработчика в кэше Nitro. */
  name: string
  /** Ключ кэша: данные ручки общие для всех пользователей. */
  key: string | ((event: H3Event) => string)
  /** Время жизни кэша, секунды. */
  ttl: number
  /** Путь upstream относительно `runtimeConfig.apiUpstream`. */
  path: string | ((event: H3Event) => string)
  /** Имя ручки для текста ошибки. */
  label: string
  /** Проверка формы ответа до маппинга. */
  isValid: (value: unknown) => value is Dto
  /** DTO → UI-тип: браузер получает наш контракт, а не ответ Laravel. */
  map: (dto: Dto) => Data
}

/**
 * Кэширующий прокси к Laravel: один запрос на TTL, маппинг на сервере, наружу — статус
 * без тела upstream. `apiFetch`, `defineCachedEventHandler` и `createError` — глобали Nitro;
 * вызываются без импорта, потому что серверные тесты подменяют их через `vi.stubGlobal`.
 */
export function defineApiProxy<Dto, Data>(options: ApiProxyOptions<Dto, Data>) {
  const { name, key, ttl, path, label, isValid, map } = options

  return defineCachedEventHandler(
    async (event: H3Event) => {
      try {
        const requestPath = typeof path === 'function' ? path(event) : path
        const dto = await apiFetch(event)<Dto>(requestPath)

        if (!isValid(dto)) {
          throw createError({
            statusCode: 502,
            statusMessage: `${label} API payload is invalid`,
          })
        }

        const body: ApiEnvelope<Data> = {
          data: map(dto),
        }

        return body
      } catch (error) {
        if (isError(error)) throw error

        throw createError({
          statusCode: upstreamStatus(error),
          statusMessage: `${label} API request failed`,
        })
      }
    },
    {
      maxAge: ttl,
      name,
      getKey: (event: H3Event) => (typeof key === 'function' ? key(event) : key),
    },
  )
}

export function upstreamStatus(error: unknown): number {
  if (typeof error !== 'object' || error === null) return 502

  const record = error as { statusCode?: unknown; status?: unknown }
  const status = record.statusCode ?? record.status

  if (typeof status === 'number' && status >= 400 && status <= 599) return status

  return 502
}
