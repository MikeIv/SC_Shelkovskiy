import type { H3Event } from 'h3'
import { basicAuthorization } from '#shared/utils/basicAuthorization'
import { normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'

const UPSTREAM_TIMEOUT_MS = 10_000

/**
 * HTTP-клиент Nitro к Laravel. База и Basic auth — из приватного `runtimeConfig`,
 * не из `public.apiBase`. В лог пишется только статус, без тела и заголовков.
 */
export function apiFetch(event?: H3Event) {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const baseURL = normalizeApiBaseUrl(config.apiUpstream)

  if (!baseURL) {
    throw createError({
      statusCode: 503,
      statusMessage: 'API upstream is not configured',
    })
  }

  const authorization = basicAuthorization(config.apiAuth)

  return $fetch.create({
    baseURL,
    timeout: UPSTREAM_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      ...(authorization ? { Authorization: authorization } : {}),
    },
    onResponseError(ctx) {
      if (import.meta.dev) {
        console.error('[apiFetch]', String(ctx.request), ctx.response.status)
      }
    },
  })
}
