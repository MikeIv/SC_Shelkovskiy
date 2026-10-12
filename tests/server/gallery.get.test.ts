import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { GalleryAlbum } from '#shared/types/gallery'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type GalleryHandler = (event: unknown) => Promise<{ data: GalleryAlbum }>

const albumDto = {
  data: {
    slug: 'stars-time-party-2026',
    title: 'Stars Time Party',
    date: '2026-05-30',
    cover: '/storage/episode/cover.jpg',
    photos_count: 13,
    has_video: false,
    items: [
      { type: 'image', src: '/storage/media-gallery/a.jpg', preview: null },
      { type: 'video', src: 'https://rutube.ru/video/x/', preview: '/storage/poster.jpg' },
      { type: 'image', src: '/storage/media-gallery/b.jpg', preview: null },
    ],
  },
}

let cacheOptions: CacheOptions | undefined
let requestedPath = ''

async function loadHandler(
  resolve: (path: string) => unknown | Promise<unknown>,
): Promise<GalleryHandler> {
  vi.resetModules()
  cacheOptions = undefined
  requestedPath = ''

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('getRouterParam', () => 'stars-time-party-2026')
  vi.stubGlobal('apiFetch', () => (path: string) => {
    requestedPath = path
    return Promise.resolve(resolve(path))
  })

  const module = await import('../../server/api/gallery/[slug].get')
  return module.default as GalleryHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/gallery/[slug].get', () => {
  it('отдаёт альбом с фото для просмотрщика и кэширует по slug', async () => {
    const handler = await loadHandler(() => albumDto)

    const body = await handler({})

    expect(requestedPath).toBe('/gallery/stars-time-party-2026')
    expect(body.data).toMatchObject({
      id: 'stars-time-party-2026',
      date: '30.05.2026',
      photoCount: 2,
      photos: ['/storage/media-gallery/a.jpg', '/storage/media-gallery/b.jpg'],
    })
    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-gallery-album')
    expect(cacheOptions?.getKey?.({})).toBe('gallery:stars-time-party-2026')
  })

  it('пробрасывает 404 upstream', async () => {
    const handler = await loadHandler(() => Promise.reject({ statusCode: 404 }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 })
  })

  it('502, если в ответе нет объекта data', async () => {
    const handler = await loadHandler(() => ({ data: 'oops' }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })

  it('502, если у альбома нет обложки', async () => {
    const handler = await loadHandler(() => ({ data: { slug: 'broken', cover: null } }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
