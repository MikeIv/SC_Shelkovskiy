import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import type { NewsListData } from '#shared/types/news'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type FeedHandler = (event: unknown) => Promise<{ data: NewsListData }>

const listDto = {
  data: [
    {
      type: 'news',
      slug: 'winter',
      title: 'Зимняя коллекция',
      image: '/images/news.jpg',
      date: '2026-09-30',
      source: { kind: 'mall', name: 'ТРЦ «Щёлковский»' },
      url: '/news/winter',
    },
  ],
  meta: { current_page: 1, last_page: 2, per_page: 12, total: 13 },
}

let cacheOptions: CacheOptions | undefined
let requestedPath = ''
let query: Record<string, string> = {}

async function loadHandler(
  resolve: (path: string) => unknown = () => listDto,
): Promise<FeedHandler> {
  vi.resetModules()
  cacheOptions = undefined
  requestedPath = ''
  query = { type: 'news' }

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('getQuery', () => query)
  vi.stubGlobal('apiFetch', () => (path: string) => {
    requestedPath = path
    return Promise.resolve(resolve(path))
  })

  const module = await import('../../server/api/feed/index.get')
  return module.default as FeedHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/feed/index.get', () => {
  it('запрашивает страницу вкладки и отдаёт карточки с meta', async () => {
    const handler = await loadHandler()

    const body = await handler({})

    expect(requestedPath).toBe('/feed?page=1&per_page=12&type=news')
    expect(body.data.items[0]).toMatchObject({ id: 'winter', tagLabel: 'Новость' })
    expect(body.data.meta).toEqual({ current_page: 1, last_page: 2, per_page: 12, total: 13 })
  })

  it('кэширует ленту на 60 секунд по вкладке и странице', async () => {
    const handler = await loadHandler()

    await handler({})

    expect(cacheOptions?.maxAge).toBe(60)
    expect(cacheOptions?.name).toBe('api-feed')
    expect(cacheOptions?.getKey?.({})).toBe('feed:news:1:12')
  })

  it('без type отдаёт новости и акции', async () => {
    const handler = await loadHandler()
    query = {}

    await handler({})

    expect(requestedPath).toBe('/feed?page=1&per_page=12')
    expect(cacheOptions?.getKey?.({})).toBe('feed:all:1:12')
  })

  it('передаёт страницу и размер страницы из запроса', async () => {
    const handler = await loadHandler()
    query = { type: 'action', page: '2', per_page: '6' }

    await handler({})

    expect(requestedPath).toBe('/feed?page=2&per_page=6&type=action')
  })

  it('400 на неизвестный type, битую страницу и слишком большой per_page', async () => {
    const handler = await loadHandler()

    query = { type: 'mall' }
    await expect(handler({})).rejects.toMatchObject({ statusCode: 400 })

    query = { type: 'news', page: '0' }
    await expect(handler({})).rejects.toMatchObject({ statusCode: 400 })

    query = { type: 'news', per_page: '500' }
    await expect(handler({})).rejects.toMatchObject({ statusCode: 400 })

    expect(requestedPath).toBe('')
  })

  it('502, если data не массив', async () => {
    const handler = await loadHandler(() => ({ data: {} }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
