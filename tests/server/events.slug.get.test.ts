import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import type { EventDetailItem } from '#shared/types/events'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type EventHandler = (event: unknown) => Promise<{ data: EventDetailItem }>

const detailDto = {
  data: {
    slug: 'concert',
    title: 'Концерт в атриуме',
    tag: 'Афиша',
    image: '/images/event.png',
    starts_at: '2026-09-29',
    ends_at: '2026-10-02',
    preview_text: 'Короткое описание',
    url: '/events/concert',
    time: '19:00',
    location: '0 этаж',
    text: '<p>Первый абзац</p>',
    program: [{ time: '19:00–20:00', title: 'Открытие' }],
    show_subscribe_cta: true,
    published_at: '2026-09-20',
    seo: null,
  },
}

let cacheOptions: CacheOptions | undefined
let requestedPath = ''

async function loadHandler(
  resolve: (path: string) => unknown | Promise<unknown>,
): Promise<EventHandler> {
  vi.resetModules()
  cacheOptions = undefined
  requestedPath = ''

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('getRouterParam', () => 'concert')
  vi.stubGlobal('apiFetch', () => (path: string) => {
    requestedPath = path
    return Promise.resolve(resolve(path))
  })

  const module = await import('../../server/api/events/[slug].get')
  return module.default as EventHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/events/[slug].get', () => {
  it('маппит детальную мероприятия', async () => {
    const handler = await loadHandler(() => detailDto)

    const body = await handler({})

    expect(requestedPath).toBe('/events/concert')
    expect(body.data).toMatchObject({
      id: 'concert',
      when: '29 сентября — 2 октября, 19:00',
      location: '0 этаж',
      program: [{ time: '19:00–20:00', title: 'Открытие' }],
      register: true,
      publishedAt: '20.09.2026',
      bodyHtml: '<p>Первый абзац</p>',
    })
    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-event')
    expect(cacheOptions?.getKey?.({})).toBe('event:concert')
  })

  it('пробрасывает 404 upstream', async () => {
    const handler = await loadHandler(() => Promise.reject({ statusCode: 404 }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 })
  })

  it('502, если в ответе нет объекта data', async () => {
    const handler = await loadHandler(() => ({ data: 'oops' }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
