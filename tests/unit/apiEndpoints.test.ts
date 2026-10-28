import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  awardEndpoint,
  awardsEndpoint,
  eventEndpoint,
  eventsEndpoint,
  feedEndpoint,
  feedItemEndpoint,
  galleryAlbumEndpoint,
  homeEndpoint,
  layoutEndpoint,
  pageEndpoint,
  tenantEndpoint,
  tenantsEndpoint,
  vacanciesEndpoint,
} from '#shared/api/endpoints'
import { ApiContractError } from '#shared/api/errors'
import { fakeRequest } from './support/fakeRequest'

/**
 * Контракты ручек — общий код Nitro-прокси и клиента в прямом режиме: параметры, путь
 * у Laravel, ключ и имя кэша, проверка формы ответа. Маппинг полей проверяют тесты
 * мапперов, транспорт и подключение маршрутов — `tests/server`.
 */

type CacheCase = {
  name: string
  endpoint: { route: string; cache: { name: string; ttl: number } }
  route: string
  cache: string
  ttl: number
}

const cacheCases = [
  { name: 'главная', endpoint: homeEndpoint, route: '/api/home', cache: 'api-home', ttl: 300 },
  {
    name: 'обвязка',
    endpoint: layoutEndpoint,
    route: '/api/layout',
    cache: 'api-layout',
    ttl: 300,
  },
  {
    name: 'страница',
    endpoint: pageEndpoint,
    route: '/api/pages/:slug',
    cache: 'api-page',
    ttl: 300,
  },
  {
    name: 'афиша',
    endpoint: eventsEndpoint,
    route: '/api/events',
    cache: 'api-events',
    ttl: 60,
  },
  {
    name: 'мероприятие',
    endpoint: eventEndpoint,
    route: '/api/events/:slug',
    cache: 'api-event',
    ttl: 300,
  },
  {
    name: 'альбом',
    endpoint: galleryAlbumEndpoint,
    route: '/api/gallery/:slug',
    cache: 'api-gallery-album',
    ttl: 300,
  },
  { name: 'лента', endpoint: feedEndpoint, route: '/api/feed', cache: 'api-feed', ttl: 60 },
  {
    name: 'запись ленты',
    endpoint: feedItemEndpoint,
    route: '/api/feed/:slug',
    cache: 'api-feed-item',
    ttl: 300,
  },
  {
    name: 'каталог',
    endpoint: tenantsEndpoint,
    route: '/api/tenants',
    cache: 'api-tenants',
    ttl: 300,
  },
  {
    name: 'арендатор',
    endpoint: tenantEndpoint,
    route: '/api/tenants/:slug',
    cache: 'api-tenant',
    ttl: 300,
  },
  {
    name: 'награды',
    endpoint: awardsEndpoint,
    route: '/api/awards',
    cache: 'api-awards',
    ttl: 300,
  },
  {
    name: 'награда',
    endpoint: awardEndpoint,
    route: '/api/awards/:slug',
    cache: 'api-award',
    ttl: 300,
  },
  {
    name: 'вакансии',
    endpoint: vacanciesEndpoint,
    route: '/api/vacancies',
    cache: 'api-vacancies',
    ttl: 300,
  },
] as const satisfies readonly CacheCase[]

/** Карточка новости для списков ленты и связанных материалов. */
const newsCardDto = {
  type: 'news',
  slug: 'winter',
  title: 'Зимняя коллекция',
  image: '/images/news.jpg',
  date: '2026-09-30',
  source: { kind: 'mall', name: 'ТРЦ «Щёлковский»' },
  url: '/news/winter',
}

const feedListDto = {
  data: [newsCardDto],
  meta: { current_page: 1, last_page: 2, per_page: 12, total: 13 },
}

const feedDetailDto = {
  data: {
    ...newsCardDto,
    type: 'action',
    published_at: '2026-09-30',
    text: '<p>Абзац текста</p>',
    gallery: [],
    seo: null,
    period: { from: '2026-10-01', to: '2026-10-31' },
  },
}

const relatedFeedDto = { data: [{ ...newsCardDto, slug: 'other' }] }

const vacanciesDto = {
  data: [
    {
      slug: 'svarschik',
      title: 'Сварщик',
      contacts: { name: null, phone: '+7 919 769-16-51', email: null },
      sections: [{ title: 'Условия:', items: ['Официальное трудоустройство'] }],
    },
  ],
}

const awardsDto = {
  data: [{ slug: 'cre', title: 'CRE', date: '2024-06-26', url: '/awards/cre' }],
}

const awardsOthersDto = {
  data: [{ slug: 'other', title: 'Другая', date: '2022-01-01', url: '/awards/other' }],
}

const awardDetailDto = {
  data: {
    slug: 'cre',
    title: 'CRE',
    date: '2021-04-04',
    url: '/awards/cre',
    subtitle: null,
    image: null,
    text: '<p>Текст</p>',
    seo: null,
  },
}

const tenantDto = JSON.parse(
  readFileSync(new URL('../fixtures/api/tenant.json', import.meta.url), 'utf8'),
) as unknown

const tenantFeedDto = JSON.parse(
  readFileSync(new URL('../fixtures/api/tenant.feed.json', import.meta.url), 'utf8'),
) as unknown

/** Прокси отвечает на невалидное тело 502 — по одному кейсу на способ проверки. */
const invalidList = { data: {} }
const invalidItem = { data: [] }

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

  it('афиша: пагинация по умолчанию, битый per_page — 400', () => {
    const params = eventsEndpoint.params({ query: {} })

    expect(eventsEndpoint.path(params)).toBe('/events?page=1&per_page=12')
    expect(eventsEndpoint.key(params)).toBe('events:1:12')
    expect(() => eventsEndpoint.params({ query: { per_page: '500' } })).toThrow(ApiContractError)
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

  it.each(cacheCases)('$name: маршрут Nitro, имя и TTL кэша', ({ endpoint, route, cache, ttl }) => {
    expect(endpoint.route).toBe(route)
    expect(endpoint.cache).toEqual({ name: cache, ttl })
  })
})

describe('контракты ручек: загрузка и форма ответа', () => {
  it('лента: отдаёт карточки страницы и meta', async () => {
    const { request, calls } = fakeRequest(() => feedListDto)
    const data = await feedEndpoint.load(request, { type: 'news', page: 1, perPage: 12 })

    expect(calls[0]?.path).toBe('/feed?page=1&per_page=12&type=news')
    expect(data.items.map((item) => item.id)).toEqual(['winter'])
    expect(data.meta).toMatchObject({ current_page: 1, total: 13 })
  })

  it('вакансии и награды: списки приходят UI-элементами', async () => {
    const vacancies = await vacanciesEndpoint.load(fakeRequest(() => vacanciesDto).request, {})
    expect(vacancies.map((item) => item.id)).toEqual(['svarschik'])

    const awards = await awardsEndpoint.load(fakeRequest(() => awardsDto).request, {})
    expect(awards.map((item) => item.id)).toEqual(['cre'])
  })

  it('лента: детальная догружает связанные записи своего типа', async () => {
    const { request, calls } = fakeRequest((path) =>
      path === '/feed' ? relatedFeedDto : feedDetailDto,
    )

    const data = await feedItemEndpoint.load(request, { slug: 'winter' })

    expect(calls[1]).toEqual({
      path: '/feed',
      query: { exclude: 'winter', per_page: 4, type: 'action' },
    })
    expect(data.item.id).toBe('winter')
    expect(data.related.map((item) => item.id)).toEqual(['other'])
  })

  it('лента: сбой связанных не роняет детальную', async () => {
    const { request } = fakeRequest((path) => {
      if (path === '/feed') return Promise.reject(new Error('feed down'))

      return feedDetailDto
    })

    const data = await feedItemEndpoint.load(request, { slug: 'winter' })

    expect(data.related).toEqual([])
    expect(data.item.id).toBe('winter')
  })

  it('награда: остальные записи догружаются без текущей', async () => {
    const { request, calls } = fakeRequest((path) =>
      path === '/awards' ? awardsOthersDto : awardDetailDto,
    )

    const data = await awardEndpoint.load(request, { slug: 'cre' })

    expect(calls[1]).toEqual({ path: '/awards', query: { exclude: 'cre' } })
    expect(data.item.id).toBe('cre')
    expect(data.related.map((item) => item.id)).toEqual(['other'])
  })

  it('арендатор: лента догружается, а её сбой не роняет карточку', async () => {
    const ok = await tenantEndpoint.load(
      fakeRequest((path) => (path === '/feed' ? tenantFeedDto : tenantDto)).request,
      { slug: 'test-shop' },
    )

    expect(ok.slug).toBe('test-shop')
    expect(ok.news.map((item) => item.id)).toEqual(['test-tenant-action'])

    const failed = await tenantEndpoint.load(
      fakeRequest((path) => (path === '/feed' ? Promise.reject(new Error('feed down')) : tenantDto))
        .request,
      { slug: 'test-shop' },
    )

    expect(failed.slug).toBe('test-shop')
    expect(failed.news).toEqual([])
  })

  it('невалидное тело — 502 без выхода наружу: список и детальная', async () => {
    await expect(
      feedEndpoint.load(fakeRequest(() => invalidList).request, {
        type: null,
        page: 1,
        perPage: 12,
      }),
    ).rejects.toMatchObject({ statusCode: 502 })

    await expect(
      feedItemEndpoint.load(fakeRequest(() => invalidItem).request, { slug: 'winter' }),
    ).rejects.toMatchObject({ statusCode: 502 })
  })

  it('502 на собственных проверках формы: главная, обвязка, страница, каталог', async () => {
    await expect(
      homeEndpoint.load(fakeRequest(() => ({ data: { slides: 'oops' } })).request, {}),
    ).rejects.toMatchObject({ statusCode: 502 })

    await expect(
      layoutEndpoint.load(fakeRequest(() => ({ data: {} })).request, {}),
    ).rejects.toMatchObject({ statusCode: 502 })

    await expect(
      pageEndpoint.load(fakeRequest(() => ({ data: {} })).request, { slug: 'contacts' }),
    ).rejects.toMatchObject({ statusCode: 502 })

    await expect(
      tenantsEndpoint.load(fakeRequest(() => ({ data: 'oops' })).request, { type: 'shops' }),
    ).rejects.toMatchObject({ statusCode: 502 })
  })

  it('502, когда маппер не собрал модель: альбом без обложки, пустая карточка', async () => {
    const albumWithoutCover = {
      data: {
        slug: 'party',
        title: 'Вечеринка',
        date: null,
        cover: null,
        photos_count: 0,
        has_video: false,
        items: [],
      },
    }

    await expect(
      galleryAlbumEndpoint.load(fakeRequest(() => albumWithoutCover).request, { slug: 'party' }),
    ).rejects.toMatchObject({ statusCode: 502 })

    await expect(
      tenantEndpoint.load(fakeRequest(() => ({ data: {} })).request, { slug: 'test-shop' }),
    ).rejects.toMatchObject({ statusCode: 502 })
  })
})
