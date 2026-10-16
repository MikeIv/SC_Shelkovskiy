import { apiErrorStatus } from '#shared/api/errors'
import type { ApiFetchOptions } from './apiFetch'

type FormFetch = <T>(
  path: string,
  opts: {
    method: 'POST'
    body: unknown
    baseURL: string | undefined
    timeout: number
    headers: Record<string, string>
  },
) => Promise<T>

/**
 * POST формы на Laravel без кэша. 422/429 пробрасываются с телом upstream,
 * чтобы клиент показал ошибки полей.
 */
export async function proxyFormPost<T>(
  options: ApiFetchOptions,
  upstreamPath: string,
  body: unknown,
  fetchImpl: FormFetch = $fetch as FormFetch,
): Promise<T> {
  try {
    return await fetchImpl<T>(upstreamPath, {
      method: 'POST',
      body,
      baseURL: options.baseURL,
      timeout: options.timeout,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    })
  } catch (error: unknown) {
    const statusCode = apiErrorStatus(error)
    const payload =
      typeof error === 'object' && error !== null && 'data' in error
        ? (error as { data: unknown }).data
        : undefined
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof (payload as { message: unknown }).message === 'string'
        ? (payload as { message: string }).message
        : 'Form API request failed'

    throw createError({
      statusCode,
      statusMessage: message,
      data: payload,
    })
  }
}
