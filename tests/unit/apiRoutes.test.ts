import { describe, expect, it } from 'vitest'
import type { ApiQuery, ApiRequest } from '#shared/api/request'
import { asApiRequest } from '#shared/api/request'
import { loadDirectApi, resolveApiRoute } from '#shared/api/direct'
import { isDirectApiBase } from '#shared/api/directBase'
import type { ApiEnvelope } from '#shared/types/api'
import type { GalleryAlbum } from '#shared/types/gallery'
import type { HomePageData } from '#shared/types/home'
import type { NewsDetailData } from '#shared/types/news'

/**
 * Прямой режим (статический хостинг): клиент сам разбирает путь `/api/*` по контракту
 * ручек и ходит в Laravel. Здесь проверяем сопоставление путей и сборку конверта.
 */

type RecordedRequest = { path: string; query?: ApiQuery }

function fakeRequest(resolve: (path: string) => unknown): {
  request: ApiRequest
  calls: RecordedRequest[]
} {
  const calls: RecordedRequest[] = []
  const request: ApiRequest = <Dto>(path: string, options?: { query?: ApiQuery }) => {
    calls.push({ path, query: options?.query })
    return Promise.resolve(resolve(path)) as Promise<Dto>
  }

  return { request, calls }
}

const homeDto = {
  data: {
    slides: [
      {
        id: 472,
        title: 'Русалочка',
        description: null,
        image: '/images/home/intro-1.png',
        image_mobile: null,
        video: null,
        url: '/events/rusalochka',
      },
    ],
    feed: [],
    brands: [],
    categories: [],
    gallery: [],
    video_url: null,
  },
}

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

describe('режим запросов выбирается базой API', () => {
  it('абсолютный apiBase — прямые запросы, пустой и относительный — прокси', () => {
    expect(isDirectApiBase('https://api.example.com/api/v1')).toBe(true)
    expect(isDirectApiBase('http://127.0.0.1:4788/api/v1')).toBe(true)
    expect(isDirectApiBase('')).toBe(false)
    expect(isDirectApiBase('/api')).toBe(false)
    expect(isDirectApiBase(undefined)).toBe(false)
  })
})

describe('resolveApiRoute', () => {
  it('находит индексные и детальные ручки', () => {
    expect(resolveApiRoute('/api/home')?.route).toBe('/api/home')
    expect(resolveApiRoute('/api/layout')?.route).toBe('/api/layout')
    expect(resolveApiRoute('/api/events?page=2&per_page=5')?.route).toBe('/api/events')
    expect(resolveApiRoute('/api/events/concert')?.route).toBe('/api/events/:slug')
    expect(resolveApiRoute('/api/feed?type=smi')?.route).toBe('/api/feed')
    expect(resolveApiRoute('/api/feed/winter')?.route).toBe('/api/feed/:slug')
    expect(resolveApiRoute('/api/gallery/stars-time-party-2026')?.route).toBe('/api/gallery/:slug')
    expect(resolveApiRoute('/api/tenants?type=shops')?.route).toBe('/api/tenants')
    expect(resolveApiRoute('/api/tenants/test-shop')?.route).toBe('/api/tenants/:slug')
  })

  it('принимает абсолютный URL и не путает лишний сегмент', () => {
    expect(resolveApiRoute('https://stand.example/api/feed?type=news')?.route).toBe('/api/feed')
    expect(resolveApiRoute('/api/feed/winter/extra')).toBeNull()
    expect(resolveApiRoute('/api/unknown')).toBeNull()
  })
})

describe('loadDirectApi', () => {
  it('отдаёт данные конвертом, как прокси', async () => {
    const { request, calls } = fakeRequest(() => homeDto)

    const body = await loadDirectApi<ApiEnvelope<HomePageData>>({
      url: '/api/home',
      request,
    })

    expect(calls.map((call) => call.path)).toEqual(['/home'])
    expect(body.data.slides[0]).toMatchObject({ id: '472', imageSrc: '/images/home/intro-1.png' })
  })

  it('детальная ленты догружает связанные материалы', async () => {
    const { request, calls } = fakeRequest((path) => (path === '/feed' ? relatedDto : detailDto))

    const body = await loadDirectApi<ApiEnvelope<NewsDetailData>>({
      url: '/api/feed/winter',
      request,
    })

    expect(calls[0]).toEqual({ path: '/feed/winter', query: undefined })
    expect(calls[1]).toEqual({ path: '/feed', query: { exclude: 'winter', per_page: 4 } })
    expect(body.data.item).toMatchObject({ id: 'winter', title: 'Зимняя коллекция' })
    expect(body.data.related).toHaveLength(1)
  })

  it('альбом галереи в прямом режиме идёт в `/gallery/{slug}`', async () => {
    const { request, calls } = fakeRequest(() => ({
      data: {
        slug: 'party',
        title: 'Вечеринка',
        date: '2026-05-30',
        cover: '/storage/episode/cover.jpg',
        photos_count: 2,
        has_video: false,
        items: [
          { type: 'image', src: '/storage/media-gallery/a.jpg', preview: null },
          { type: 'video', src: 'https://rutube.ru/video/x/', preview: '/storage/poster.jpg' },
        ],
      },
    }))

    const body = await loadDirectApi<ApiEnvelope<GalleryAlbum>>({
      url: '/api/gallery/party',
      request,
    })

    expect(calls[0]).toEqual({ path: '/gallery/party', query: undefined })
    expect(body.data).toMatchObject({
      id: 'party',
      photoCount: 1,
      photos: ['/storage/media-gallery/a.jpg'],
    })
  })

  it('query поверх URL — для императивных вызовов («показать ещё»)', async () => {
    const { request, calls } = fakeRequest(() => ({ data: [], meta: null }))

    await loadDirectApi({ url: '/api/feed?type=news&page=1', request, query: { page: 2 } })

    expect(calls[0]?.path).toBe('/feed?page=2&per_page=12&type=news')
  })

  it('неизвестный путь — 404, битые параметры — 400', async () => {
    const { request } = fakeRequest(() => homeDto)

    await expect(loadDirectApi({ url: '/api/unknown', request })).rejects.toMatchObject({
      statusCode: 404,
    })
    await expect(loadDirectApi({ url: '/api/feed?page=0', request })).rejects.toMatchObject({
      statusCode: 400,
    })
  })
})

describe('asApiRequest', () => {
  it('передаёт путь и query в клиент', async () => {
    const calls: RecordedRequest[] = []
    const request = asApiRequest((path, options) => {
      calls.push({ path, query: options?.query })
      return Promise.resolve({ data: [] })
    })

    await request('/api/feed', { query: { page: 2 } })

    expect(calls[0]).toEqual({ path: '/api/feed', query: { page: 2 } })
  })
})
