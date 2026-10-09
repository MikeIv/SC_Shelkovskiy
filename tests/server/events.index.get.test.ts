import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { EventsListData } from '#shared/types/events'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type EventsHandler = (event: unknown) => Promise<{ data: EventsListData }>

const listDto = {
  data: [
    {
      slug: 'concert',
      title: 'Концерт в атриуме',
      tag: 'Афиша',
      image: '/images/event.png',
      starts_at: '2026-09-29',
      ends_at: '2026-10-02',
      preview_text: 'Короткое описание',
      url: '/events/concert',
    },
  ],
  meta: { current_page: 1, last_page: 1, per_page: 12, total: 1 },
}

let cacheOptions: CacheOptions | undefined
let requestedPath = ''
let query: Record<string, string> = {}

async function loadHandler(
  resolve: (path: string) => unknown = () => listDto,
): Promise<EventsHandler> {
  vi.resetModules()
  cacheOptions = undefined
  requestedPath = ''
  query = {}

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('getQuery', () => query)
  vi.stubGlobal('apiFetch', () => (path: string) => {
    requestedPath = path
    return Promise.resolve(resolve(path))
  })

  const module = await import('../../server/api/events/index.get')
  return module.default as EventsHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/events/index.get', () => {
  it('запрашивает афишу и отдаёт карточки с датами', async () => {
    const handler = await loadHandler()

    const body = await handler({})

    expect(requestedPath).toBe('/events?page=1&per_page=12')
    expect(body.data.items[0]).toMatchObject({
      id: 'concert',
      dateStart: { day: '29', month: 'сентября' },
    })
    expect(body.data.meta).toMatchObject({ total: 1 })
  })

  it('кэширует афишу на 60 секунд по странице', async () => {
    const handler = await loadHandler()

    await handler({})

    expect(cacheOptions?.maxAge).toBe(60)
    expect(cacheOptions?.name).toBe('api-events')
    expect(cacheOptions?.getKey?.({})).toBe('events:1:12')
  })

  it('400 на битую пагинацию и не ходит в upstream', async () => {
    const handler = await loadHandler()
    query = { page: '-1' }

    await expect(handler({})).rejects.toMatchObject({ statusCode: 400 })
    expect(requestedPath).toBe('')
  })

  it('502, если data не массив', async () => {
    const handler = await loadHandler(() => ({ data: 'oops' }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
