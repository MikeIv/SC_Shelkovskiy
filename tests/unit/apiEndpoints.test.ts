import { describe, expect, it } from 'vitest'
import type { ApiQuery, ApiRequest } from '#shared/api/endpoints'
import {
  eventsEndpoint,
  feedEndpoint,
  galleryAlbumEndpoint,
  tenantEndpoint,
  tenantsEndpoint,
} from '#shared/api/endpoints'
import { ApiContractError } from '#shared/api/errors'

/**
 * Контракты ручек — общий код Nitro-прокси и клиента в прямом режиме,
 * поэтому проверяем разбор параметров, путь у Laravel и проверку формы ответа.
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

const feedListDto = {
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

describe('контракты ручек: параметры и путь у Laravel', () => {
  it('лента: вкладка и пагинация по умолчанию', () => {
    const params = feedEndpoint.params({ query: {} })

    expect(params).toEqual({ type: null, page: 1, perPage: 12 })
    expect(feedEndpoint.key(params)).toBe('feed:all:1:12')
    expect(feedEndpoint.path(params)).toBe('/feed?page=1&per_page=12')
  })

  it('лента: вкладка и страница из query', () => {
    const params = feedEndpoint.params({ query: { type: 'action', page: '2', per_page: '6' } })

    expect(feedEndpoint.key(params)).toBe('feed:action:2:6')
    expect(feedEndpoint.path(params)).toBe('/feed?page=2&per_page=6&type=action')
  })

  it('лента: императивный вызов передаёт страницу числом', () => {
    const params = feedEndpoint.params({ query: { type: 'news', page: 3, per_page: 12 } })

    expect(feedEndpoint.key(params)).toBe('feed:news:3:12')
  })

  it('лента: неизвестная вкладка, битая страница и большой per_page — 400', () => {
    expect(() => feedEndpoint.params({ query: { type: 'mall' } })).toThrow(ApiContractError)
    expect(() => feedEndpoint.params({ query: { page: '0' } })).toThrow(ApiContractError)
    expect(() => feedEndpoint.params({ query: { per_page: '500' } })).toThrow(ApiContractError)
  })

  it('афиша: страница по умолчанию и путь у Laravel', () => {
    const params = eventsEndpoint.params({ query: {} })

    expect(eventsEndpoint.path(params)).toBe('/events?page=1&per_page=12')
    expect(eventsEndpoint.key(params)).toBe('events:1:12')
  })

  it('каталог: тип раздела обязателен', () => {
    const params = tenantsEndpoint.params({ query: { type: 'shops' } })

    expect(params).toEqual({ type: 'shops' })
    expect(tenantsEndpoint.path(params)).toBe('/tenants?type=shops')
    expect(() => tenantsEndpoint.params({ query: { type: 'mall' } })).toThrow(ApiContractError)
  })

  it('детальная арендатора: пустой slug — 400', () => {
    expect(() => tenantEndpoint.params({ query: {} })).toThrow(ApiContractError)
    expect(tenantEndpoint.params({ query: {}, slug: 'test-shop' })).toEqual({ slug: 'test-shop' })
  })

  it('альбом галереи: slug обязателен, путь у Laravel без query', () => {
    expect(() => galleryAlbumEndpoint.params({ query: {} })).toThrow(ApiContractError)

    const params = galleryAlbumEndpoint.params({ query: {}, slug: 'stars-time-party-2026' })

    expect(galleryAlbumEndpoint.path(params)).toBe('/gallery/stars-time-party-2026')
    expect(galleryAlbumEndpoint.key(params)).toBe('gallery:stars-time-party-2026')
  })
})

describe('контракты ручек: загрузка и маппинг', () => {
  it('лента: маппит карточки и meta', async () => {
    const { request, calls } = fakeRequest(() => feedListDto)
    const params = feedEndpoint.params({ query: { type: 'news' } })

    const data = await feedEndpoint.load(request, params)

    expect(calls[0]?.path).toBe('/feed?page=1&per_page=12&type=news')
    expect(data.items[0]).toMatchObject({ id: 'winter', tagLabel: 'Новость' })
    expect(data.meta).toEqual({ current_page: 1, last_page: 2, per_page: 12, total: 13 })
  })

  it('лента: невалидное тело — 502 без выхода наружу', async () => {
    const { request } = fakeRequest(() => ({ data: {} }))

    await expect(
      feedEndpoint.load(request, { type: null, page: 1, perPage: 12 }),
    ).rejects.toMatchObject({ statusCode: 502 })
  })

  it('каталог: невалидное тело — 502', async () => {
    const { request } = fakeRequest(() => ({ data: 'oops' }))

    await expect(tenantsEndpoint.load(request, { type: 'shops' })).rejects.toMatchObject({
      statusCode: 502,
    })
  })

  it('альбом галереи: маппит фото и отбрасывает видео', async () => {
    const { request, calls } = fakeRequest(() => ({
      data: {
        slug: 'party',
        title: 'Вечеринка',
        date: '2026-05-30',
        cover: '/storage/cover.jpg',
        photos_count: 3,
        has_video: true,
        items: [
          { type: 'image', src: '/storage/a.jpg', preview: null },
          { type: 'video', src: 'https://rutube.ru/video/x/', preview: '/storage/poster.jpg' },
        ],
      },
    }))

    const album = await galleryAlbumEndpoint.load(request, { slug: 'party' })

    expect(calls[0]?.path).toBe('/gallery/party')
    expect(album).toMatchObject({ id: 'party', photoCount: 1, photos: ['/storage/a.jpg'] })
  })

  it('альбом галереи: невалидное тело — 502', async () => {
    const { request } = fakeRequest(() => ({ data: 'oops' }))

    await expect(galleryAlbumEndpoint.load(request, { slug: 'party' })).rejects.toMatchObject({
      statusCode: 502,
    })
  })
})
