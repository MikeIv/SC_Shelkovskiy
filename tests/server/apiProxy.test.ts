import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { ApiEndpoint, ApiQuery, ApiRequest } from '#shared/api/endpoints'
import { ApiContractError, invalidPayload } from '#shared/api/errors'
import { defineApiProxy } from '../../server/utils/apiProxy'
import { readApiQuery, readApiSlug } from '../../server/utils/apiQuery'

/**
 * Транспорт GET-ручек: `defineApiProxy` один на все маршруты `server/api`, поэтому его
 * проверяем здесь — вместо копии «конверт, кэш и ошибки» в тесте каждой ручки.
 * Что подключает маршрут к своему контракту — в `routes.get.test.ts`.
 */

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type Params = { page: number; slug: string }

type UpstreamCall = { path: string; query?: ApiQuery }

type Handler = (event: unknown) => Promise<unknown>

type NitroStubs = {
  /** Ответ Laravel: тем же путём, что пришёл в `apiFetch`. */
  respond?: (call: UpstreamCall) => unknown
  /** Сбой на этапе `apiFetch(event)`: например, не настроен upstream. */
  fetchError?: unknown
  /** `getRouterParam` — `null` имитирует ручку без slug в пути. */
  slug?: string | null
}

/** Стенд Nitro: `defineApiProxy` берёт эти глобали без импорта. */
const nitro: { cache?: CacheOptions; calls: UpstreamCall[] } = { calls: [] }

function stubNitro(stubs: NitroStubs = {}) {
  nitro.cache = undefined
  nitro.calls = []

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    nitro.cache = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('getQuery', () => ({ page: '2' }))
  vi.stubGlobal('getRouterParam', (_event: unknown, name: string) =>
    name === 'slug' ? (stubs.slug === null ? undefined : (stubs.slug ?? 'winter')) : undefined,
  )
  vi.stubGlobal('apiFetch', () => {
    if (stubs.fetchError) throw stubs.fetchError

    return (path: string, options?: { query?: ApiQuery }): Promise<unknown> => {
      const call: UpstreamCall = { path, query: options?.query }
      nitro.calls.push(call)

      return Promise.resolve(stubs.respond?.(call) ?? { data: true })
    }
  })
}

function makeEndpoint(
  overrides: Partial<ApiEndpoint<Params, unknown>> = {},
): ApiEndpoint<Params, unknown> {
  const endpoint: ApiEndpoint<Params, unknown> = {
    route: '/api/test/:slug',
    cache: { name: 'api-test', ttl: 300 },
    label: 'Test',
    params: ({ query, slug }) => ({ page: Number(query.page ?? 1), slug: slug ?? '' }),
    key: ({ page, slug }) => `test:${slug}:${page}`,
    path: ({ page, slug }) => `/test/${slug}?page=${page}`,
    load: async (request: ApiRequest, params: Params) => {
      const body = await request<{ data: unknown }>(`/test/${params.slug}?page=${params.page}`)

      return { ok: body.data === true }
    },
  }

  return { ...endpoint, ...overrides }
}

/** Обработчик так, как его вызывает Nitro: событие и `Promise`. */
function proxy(overrides: Partial<ApiEndpoint<Params, unknown>> = {}): Handler {
  return defineApiProxy(makeEndpoint(overrides), {
    query: readApiQuery,
    slug: readApiSlug,
  }) as unknown as Handler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('defineApiProxy', () => {
  it('читает query и slug, ходит в Laravel и отдаёт конверт', async () => {
    stubNitro()

    await expect(proxy()({})).resolves.toEqual({ data: { ok: true } })
    expect(nitro.calls).toEqual([{ path: '/test/winter?page=2', query: undefined }])
  })

  it('кэш берёт имя и TTL у контракта, ключ — по параметрам', async () => {
    stubNitro()

    await proxy()({})

    expect(nitro.cache).toMatchObject({ maxAge: 300, name: 'api-test' })
    expect(nitro.cache?.getKey?.({})).toBe('test:winter:2')
  })

  it('битые параметры — 400, ключ кэша не падает, upstream не вызывается', async () => {
    stubNitro()
    const handler = proxy({
      params: () => {
        throw new ApiContractError(400, 'Test params are invalid')
      },
    })

    expect(() => nitro.cache?.getKey?.({})).not.toThrow()
    expect(nitro.cache?.getKey?.({})).toBe('api-test:invalid')
    await expect(handler({})).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Test params are invalid',
    })
    expect(nitro.calls).toEqual([])
  })

  it('отсутствующий slug приходит пустой строкой', async () => {
    stubNitro({ slug: null })

    await proxy()({})

    expect(nitro.calls[0]?.path).toBe('/test/?page=2')
  })

  it('невалидное тело ответа — 502 с текстом ручки', async () => {
    stubNitro()
    const handler = proxy({
      load: () => {
        throw invalidPayload('Test')
      },
    })

    await expect(handler({})).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'Test API payload is invalid',
    })
  })

  it('h3-ошибку upstream отдаёт как есть', async () => {
    stubNitro({
      fetchError: createError({ statusCode: 503, statusMessage: 'API is not configured' }),
    })

    await expect(proxy()({})).rejects.toMatchObject({
      statusCode: 503,
      statusMessage: 'API is not configured',
    })
  })

  it('статус ошибки upstream сохраняется, а не подменяется на 502', async () => {
    stubNitro({ respond: () => Promise.reject({ statusCode: 429 }) })
    await expect(proxy()({})).rejects.toMatchObject({ statusCode: 429 })

    stubNitro({ respond: () => Promise.reject({ statusCode: 404 }) })
    await expect(proxy()({})).rejects.toMatchObject({ statusCode: 404 })
  })

  it('неизвестная ошибка — 502 без тела upstream', async () => {
    stubNitro({ respond: () => Promise.reject(new Error('socket hang up')) })

    await expect(proxy()({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
