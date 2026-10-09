import type { ApiEvent } from './apiEvent'
import { basicAuthorization } from '#shared/utils/basicAuthorization'
import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'

const UPSTREAM_TIMEOUT_MS = 10_000

export type ApiRuntimeConfig = {
  apiUpstream?: unknown
  apiAuth?: unknown
}

/** Опции HTTP-клиента к Laravel: база, таймаут, Accept и Basic из приватного `runtimeConfig`. */
export type ApiFetchOptions = {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

/**
 * Контракт клиента вынесен отдельно от Nuxt-автоимпортов: так его проверяет юнит-тест,
 * а `apiFetch` остаётся тонкой обёрткой над `$fetch.create`.
 */
export function buildApiFetchOptions(config: ApiRuntimeConfig): ApiFetchOptions {
  const baseURL = normalizeApiBaseUrl(config.apiUpstream)

  if (!baseURL) {
    throw createError({
      statusCode: 503,
      statusMessage: 'API upstream is not configured',
    })
  }

  const credentials = typeof config.apiAuth === 'string' ? config.apiAuth : undefined
  const authorization = basicAuthorization(credentials)

  return {
    baseURL,
    timeout: UPSTREAM_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      ...(authorization ? { Authorization: authorization } : {}),
    },
  }
}

/**
 * HTTP-клиент Nitro к Laravel. База и Basic auth — из приватного `runtimeConfig`,
 * не из `public.apiBase`. В лог пишется только статус, без тела и заголовков.
 */
export function apiFetch(event?: ApiEvent) {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()

  return $fetch.create({
    ...buildApiFetchOptions(config),
    onResponseError(ctx) {
      if (import.meta.dev) {
        console.error('[apiFetch]', String(ctx.request), ctx.response.status)
      }
    },
  })
}
