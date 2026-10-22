import { describe, expect, it } from 'vitest'
import type { ApiQuery, ApiRequest } from '#shared/api/endpoints'
import {
  awardEndpoint,
  awardsEndpoint,
  eventsEndpoint,
  feedEndpoint,
  galleryAlbumEndpoint,
  tenantEndpoint,
  tenantsEndpoint,
  vacanciesEndpoint,
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

  it('вакансии: без параметров, путь у Laravel и ключ кэша', () => {
    const params = vacanciesEndpoint.params({ query: {} })

    expect(params).toEqual({})
    expect(vacanciesEndpoint.path(params)).toBe('/vacancies')
    expect(vacanciesEndpoint.key(params)).toBe('vacancies')
  })

  it('награды: без пагинации, slug детальной обязателен', () => {
    const params = awardsEndpoint.params({ query: {} })

    expect(params).toEqual({})
    expect(awardsEndpoint.path(params)).toBe('/awards')
    expect(awardsEndpoint.key(params)).toBe('awards')
    expect(() => awardEndpoint.params({ query: {} })).toThrow(ApiContractError)
    expect(awardEndpoint.path({ slug: 'cre' })).toBe('/awards/cre')
    expect(awardEndpoint.key({ slug: 'cre' })).toBe('award:cre')
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

  it('вакансии: маппит карточки и собирает ссылки контактов', async () => {
    const { request, calls } = fakeRequest(() => ({
      data: [
        {
          slug: 'svarschik',
          title: 'Сварщик',
          contacts: { name: null, phone: '+7 919 769-16-51', email: null },
          sections: [{ title: 'Условия:', items: ['Официальное трудоустройство'] }],
        },
      ],
    }))

    const items = await vacanciesEndpoint.load(request, {})

    expect(calls[0]?.path).toBe('/vacancies')
    expect(items[0]).toMatchObject({
      id: 'svarschik',
      title: 'Сварщик',
      contacts: { phoneHref: 'tel:+79197691651' },
    })
  })

  it('вакансии: невалидное тело — 502', async () => {
    const { request } = fakeRequest(() => ({ data: 'oops' }))

    await expect(vacanciesEndpoint.load(request, {})).rejects.toMatchObject({ statusCode: 502 })
  })

  it('награды: маппит карточки, дату и пропускает запись без slug', async () => {
    const { request, calls } = fakeRequest(() => ({
      data: [
        { slug: 'cre', title: 'CRE', date: '2024-06-26', url: '/awards/cre' },
        { slug: 'no-date', title: 'Без даты', date: null, url: '/awards/no-date' },
        { title: 'Без slug' },
      ],
    }))

    const items = await awardsEndpoint.load(request, {})

    expect(calls[0]?.path).toBe('/awards')
    expect(items).toEqual([
      { id: 'cre', title: 'CRE', date: '26.06.2024', dateIso: '2024-06-26' },
      { id: 'no-date', title: 'Без даты', date: '', dateIso: '' },
    ])
  })

  it('награда: маппит текст и догружает остальные без текущей', async () => {
    const { request, calls } = fakeRequest((path) => {
      if (path === '/awards') {
        return {
          data: [{ slug: 'other', title: 'Другая', date: '2022-01-01', url: '/awards/other' }],
        }
      }

      return {
        data: {
          slug: 'cre',
          title: 'CRE',
          date: '2021-04-04',
          url: '/awards/cre',
          subtitle: 'Зеленая повестка',
          image: 'https://cdn.example/a.jpg',
          text: '<p>Текст</p><p> </p><script>alert(1)</script>',
          seo: { title: 'SEO', description: 'Описание', keywords: null, og_image: null },
        },
      }
    })

    const data = await awardEndpoint.load(request, { slug: 'cre' })

    expect(calls[0]?.path).toBe('/awards/cre')
    expect(calls[1]).toEqual({ path: '/awards', query: { exclude: 'cre' } })
    expect(data.item).toMatchObject({
      id: 'cre',
      date: '04.04.2021',
      subtitle: 'Зеленая повестка',
      bodyHtml: '<p>Текст</p>',
      imageSrc: 'https://cdn.example/a.jpg',
      seo: { title: 'SEO', description: 'Описание' },
    })
    expect(data.related).toEqual([
      { id: 'other', title: 'Другая', date: '01.01.2022', dateIso: '2022-01-01' },
    ])
  })

  it('награда: сбой связанных не роняет карточку', async () => {
    const request: ApiRequest = <Dto>(path: string) => {
      if (path === '/awards') return Promise.reject(new Error('down')) as Promise<Dto>

      return Promise.resolve({
        data: { slug: 'cre', title: 'CRE', date: '2021-04-04', subtitle: null, text: null },
      }) as Promise<Dto>
    }

    const data = await awardEndpoint.load(request, { slug: 'cre' })

    expect(data.item.id).toBe('cre')
    expect(data.item.bodyHtml).toBe('')
    expect(data.related).toEqual([])
  })

  it('награды: невалидное тело — 502', async () => {
    const { request } = fakeRequest(() => ({ data: {} }))

    await expect(awardsEndpoint.load(request, {})).rejects.toMatchObject({ statusCode: 502 })
    await expect(awardEndpoint.load(request, { slug: 'cre' })).rejects.toMatchObject({
      statusCode: 502,
    })
  })
})
