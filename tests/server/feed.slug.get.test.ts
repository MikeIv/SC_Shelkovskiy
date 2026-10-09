import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { NewsDetailData } from '#shared/types/news'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type Request = { path: string; query?: Record<string, unknown> }

type FeedItemHandler = (event: unknown) => Promise<{ data: NewsDetailData }>

const detailDto = {
  data: {
    type: 'news',
    slug: 'winter',
    title: 'Зимняя коллекция',
    image: '/images/news.jpg',
    date: '2026-09-30',
    source: { kind: 'mall', name: 'ТРЦ «Щёлковский»' },
    url: '/news/winter',
    published_at: '2026-09-30',
    text: '<p>Абзац текста</p>',
    gallery: [],
    seo: null,
  },
}

const relatedDto = {
  data: [
    {
      type: 'news',
      slug: 'other',
      title: 'Другая новость',
      image: '/images/other.jpg',
      date: '2026-10-01',
      source: { kind: 'mall', name: 'ТРЦ «Щёлковский»' },
      url: '/news/other',
    },
  ],
}

let cacheOptions: CacheOptions | undefined
const requests: Request[] = []

async function loadHandler(
  resolve: (path: string) => unknown | Promise<unknown>,
): Promise<FeedItemHandler> {
  vi.resetModules()
  cacheOptions = undefined
  requests.length = 0

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('getRouterParam', () => 'winter')
  vi.stubGlobal(
    'apiFetch',
    () =>
      (path: string, options?: { query?: Record<string, unknown> }): Promise<unknown> => {
        requests.push({ path, query: options?.query })
        return Promise.resolve(resolve(path))
      },
  )

  const module = await import('../../server/api/feed/[slug].get')
  return module.default as FeedItemHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/feed/[slug].get', () => {
  it('маппит детальную и подмешивает связанные новости', async () => {
    const handler = await loadHandler((path) => (path === '/feed' ? relatedDto : detailDto))

    const body = await handler({})

    expect(requests[0]).toEqual({ path: '/feed/winter', query: undefined })
    expect(requests[1]).toEqual({
      path: '/feed',
      query: { exclude: 'winter', per_page: 4 },
    })
    expect(body.data.item).toMatchObject({
      id: 'winter',
      publishedAt: '30 сентября 2026',
      bodyHtml: '<p>Абзац текста</p>',
    })
    expect(body.data.related).toHaveLength(1)
    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-feed-item')
    expect(cacheOptions?.getKey?.({})).toBe('feed:winter')
  })

  it('для акции связанные запрашивает по её типу', async () => {
    const actionDto = {
      data: { ...detailDto.data, type: 'action', period: { from: '2026-10-01', to: '2026-10-31' } },
    }
    const handler = await loadHandler((path) => (path === '/feed' ? relatedDto : actionDto))

    await handler({})

    expect(requests[1]?.query).toEqual({ exclude: 'winter', per_page: 4, type: 'action' })
  })

  it('отдаёт детальную без связанных, если /feed упал', async () => {
    const handler = await loadHandler((path) => {
      if (path === '/feed') return Promise.reject(new Error('feed down'))
      return detailDto
    })

    const body = await handler({})

    expect(body.data.related).toEqual([])
    expect(body.data.item.title).toBe('Зимняя коллекция')
  })

  it('пробрасывает 404 upstream', async () => {
    const handler = await loadHandler(() => Promise.reject({ statusCode: 404 }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 })
  })

  it('502, если в ответе нет объекта data', async () => {
    const handler = await loadHandler(() => ({ data: [] }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
