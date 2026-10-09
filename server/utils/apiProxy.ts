import type { ApiEndpoint, ApiQuery } from '#shared/api/endpoints'
import { apiErrorStatus, isApiContractError } from '#shared/api/errors'
import type { ApiEnvelope } from '#shared/types/api'
import type { ApiEvent } from './apiEvent'

/**
 * Источники входа серверной ручки: `query` и `slug` из события Nitro.
 * У индексных ручек slug не читаем — у них нет параметра пути.
 */
export type ApiInputReaders = {
  query?: (event: ApiEvent) => ApiQuery
  slug?: (event: ApiEvent) => string
}

/**
 * Кэширующий прокси ручки. Контракт живёт в `shared/api/endpoints` и общий с клиентом,
 * поэтому здесь только транспорт, кэш Nitro и перевод ошибок контракта в `createError`.
 *
 * `apiFetch`, `defineCachedEventHandler`, `createError` и `isError` — глобали Nitro;
 * вызываются без импорта, потому что серверные тесты подменяют их через `vi.stubGlobal`.
 */
export function defineApiProxy<Params, Data>(
  endpoint: ApiEndpoint<Params, Data>,
  readers: ApiInputReaders = {},
) {
  const readInput = (event: ApiEvent) => ({
    query: readers.query ? readers.query(event) : {},
    slug: readers.slug ? readers.slug(event) : undefined,
  })

  return defineCachedEventHandler(
    async (event: ApiEvent) => {
      try {
        const params = endpoint.params(readInput(event))
        const request = apiFetch(event)

        const data = await endpoint.load(request, params)
        const body: ApiEnvelope<Data> = { data }

        return body
      } catch (error) {
        throw toApiError(error, endpoint.label)
      }
    },
    {
      maxAge: endpoint.cache.ttl,
      name: endpoint.cache.name,
      /**
       * Ключ кэша считается по параметрам, но битые параметры здесь не роняем: `getKey`
       * выполняется до обработчика, и ошибка контракта превратилась бы в 500.
       * Ручка всё равно ответит 400 — до кэша дело не доходит.
       */
      getKey: (event: ApiEvent) => {
        try {
          return endpoint.key(endpoint.params(readInput(event)))
        } catch {
          return `${endpoint.cache.name}:invalid`
        }
      },
    },
  )
}

/**
 * Наружу — статус без тела upstream: ошибка контракта отдаёт свой код и текст,
 * h3-ошибка (например, 503 без настроенного upstream) проходит как есть,
 * всё остальное становится 502.
 */
export function toApiError(error: unknown, label: string): unknown {
  if (isApiContractError(error)) {
    return createError({ statusCode: error.statusCode, statusMessage: error.message })
  }

  if (isError(error)) return error

  return createError({
    statusCode: apiErrorStatus(error),
    statusMessage: `${label} API request failed`,
  })
}
