import type { ApiMutation } from '#shared/api/mutations'
import { apiErrorStatus, isApiContractError } from '#shared/api/errors'
import type { ApiEvent } from './apiEvent'

/**
 * Прокси мутации: тело читает и проверяет контракт ручки, запрос идёт в Laravel
 * без кэша и без ожидания окна лимита.
 *
 * `defineEventHandler`, `readBody`, `apiWriteFetch`, `createError` и `isError` — глобали
 * Nitro; вызываются без импорта, потому что серверные тесты подменяют их через `vi.stubGlobal`
 * (тот же приём, что в `apiProxy.ts`).
 */
export function defineApiMutationProxy<Payload, Data>(mutation: ApiMutation<Payload, Data>) {
  return defineEventHandler(async (event: ApiEvent) => {
    try {
      const payload = mutation.payload(await readBody(event))

      return await mutation.load(apiWriteFetch(event), payload)
    } catch (error) {
      throw toApiMutationError(error, mutation.label)
    }
  })
}

/** Тело upstream уходит в браузер только на 422: форме нужны ошибки полей. */
const FORWARD_BODY_STATUS = 422

/** Тело ответа upstream из ofetch-ошибки. */
function upstreamBody(error: unknown): unknown {
  return typeof error === 'object' && error !== null && 'data' in error
    ? (error as { data: unknown }).data
    : undefined
}

/**
 * Наружу — статус без тела upstream, как в `toApiError`, кроме 422: форме нужны ошибки полей.
 *
 * Текст ошибки идёт в `message`, а не в `statusMessage`: в статусной строке допустим только
 * ASCII, h3 вырезает кириллицу и пишет предупреждение в лог.
 */
export function toApiMutationError(error: unknown, label: string): unknown {
  if (isApiContractError(error)) {
    return createError({ statusCode: error.statusCode, statusMessage: error.message })
  }

  const statusCode = apiErrorStatus(error)
  const body = upstreamBody(error)

  if (statusCode === FORWARD_BODY_STATUS && body !== undefined) {
    return createError({ statusCode, message: `${label} validation failed`, data: body })
  }

  if (isError(error)) return error

  return createError({
    statusCode,
    statusMessage: `${label} API request failed`,
  })
}
