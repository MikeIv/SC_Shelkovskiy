import { describe, expect, it } from 'vitest'
import {
  buildAfishaFetchOptions,
  fetchAfishaCinema,
  readAfishaSettings,
  resolveCityId,
  resolvePlaceId,
} from '../../server/utils/afishaApi'

/**
 * Клиент Афиши: настройки из `runtimeConfig`, справочники города и площадки, расписание.
 * HTTP не поднимаем — запросы к API подменяет `fakeAfisha`.
 */

type AfishaCall = { path: string; query?: Record<string, string> }

function fakeAfisha(respond: (call: AfishaCall) => unknown) {
  const calls: AfishaCall[] = []

  function request<Dto>(path: string, options?: { query?: Record<string, string> }): Promise<Dto> {
    const call: AfishaCall = { path, query: options?.query }
    calls.push(call)

    return Promise.resolve(respond(call) as Dto)
  }

  return { request, calls }
}

const SETTINGS = {
  partnerKey: 'partner-key',
  widgetKey: 'widget-key',
  cityId: '',
  placeId: '',
  placeName: 'ОККО',
}

const CITIES = [{ Id: 2, Name: 'Москва' }]
const PLACES = [
  { Id: 10, CityId: 2, Type: 'Theatre', Name: 'Театр' },
  { Id: 4242, CityId: 2, Type: 'Cinema', Name: 'КИНО ОККО' },
]
const SCHEDULE = [
  {
    Creation: {
      Id: '989798',
      Type: 'Movie',
      Name: 'Кодекс Данте',
      Genres: ['Mystery'],
      AgeRestriction: 'Audience18',
      Images: [{ Url: 'https://cdn.afisha.ru/poster.jpg', Type: 'Poster' }],
      AfishaCreationUrl: 'https://www.afisha.ru/movie/kodeks-dante/',
    },
    Sessions: [{ Id: 1, IsSaleAvailable: true, SessionDateTime: '2026-11-01T18:00:00+03:00' }],
  },
]

describe('readAfishaSettings', () => {
  it('читает приватные ключи и подставляет кинотеатр по умолчанию', () => {
    const settings = readAfishaSettings({
      afishaPartnerKey: ' partner ',
      afishaCityId: ' 2 ',
      afishaPlaceId: '',
      afishaPlaceName: '',
      public: { afishaWidgetKey: 'widget' },
    })

    expect(settings).toEqual({
      partnerKey: 'partner',
      widgetKey: 'widget',
      cityId: '2',
      placeId: '',
      placeName: 'ОККО',
    })
  })

  it('без партнёрского ключа — 503, а не запрос без авторизации', () => {
    expect(() => buildAfishaFetchOptions({ ...SETTINGS, partnerKey: '' })).toThrowError(
      expect.objectContaining({ statusCode: 503 }),
    )
  })
})

describe('buildAfishaFetchOptions', () => {
  it('ставит партнёрский ключ в заголовок и базу API Афиши', () => {
    expect(buildAfishaFetchOptions(SETTINGS)).toEqual({
      baseURL: 'https://api.afisha.ru',
      timeout: 10_000,
      headers: {
        Accept: 'application/json',
        'X-ApiAuth-PartnerKey': 'partner-key',
      },
    })
  })
})

describe('справочники Афиши', () => {
  it('город ищется по названию, площадка — по вхождению в название', async () => {
    const { request, calls } = fakeAfisha((call) => (call.path === '/v3/cities' ? CITIES : PLACES))

    await expect(resolveCityId(request)).resolves.toBe('2')

    const placeId = await resolvePlaceId(request, SETTINGS, '2')

    expect(placeId).toBe('4242')
    expect(calls[1]).toEqual({
      path: '/v3/places',
      query: { CityId: '2', CreationType: 'Movie', WidgetKey: 'widget-key' },
    })
  })

  it('не нашёл город или площадку — 502', async () => {
    const empty = fakeAfisha(() => [])

    await expect(resolveCityId(empty.request)).rejects.toMatchObject({ statusCode: 502 })
    await expect(resolvePlaceId(empty.request, SETTINGS, '2')).rejects.toMatchObject({
      statusCode: 502,
    })
  })
})

describe('fetchAfishaCinema', () => {
  it('сам находит город и площадку и берёт их расписание', async () => {
    const { request, calls } = fakeAfisha((call) => {
      if (call.path === '/v3/cities') return CITIES
      if (call.path === '/v3/places') return PLACES

      return SCHEDULE
    })

    const data = await fetchAfishaCinema(request, SETTINGS)

    expect(calls.at(-1)).toEqual({
      path: '/v3/places/4242/schedule',
      query: { WidgetKey: 'widget-key' },
    })
    expect(data.cityId).toBe('2')
    expect(data.placeId).toBe('4242')
    expect(data.items[0]).toMatchObject({ id: '989798', title: 'Кодекс Данте', ageRating: '18+' })
  })

  it('с заданными id не ходит в справочники', async () => {
    const { request, calls } = fakeAfisha(() => SCHEDULE)

    const data = await fetchAfishaCinema(request, { ...SETTINGS, cityId: '2', placeId: '4242' })

    expect(calls).toEqual([
      { path: '/v3/places/4242/schedule', query: { WidgetKey: 'widget-key' } },
    ])
    expect(data.items).toHaveLength(1)
  })

  it('без ключа виджета — 503: Афиша требует WidgetKey в запросах расписания', async () => {
    const { request } = fakeAfisha(() => SCHEDULE)

    await expect(fetchAfishaCinema(request, { ...SETTINGS, widgetKey: '' })).rejects.toMatchObject({
      statusCode: 503,
    })
  })
})
