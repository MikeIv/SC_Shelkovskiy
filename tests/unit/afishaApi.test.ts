import { describe, expect, it } from 'vitest'
import {
  AFISHA_WIDGET_API_BASE,
  buildAfishaFetchOptions,
  fetchAfishaCinema,
  readAfishaSettings,
} from '../../server/utils/afishaApi'

/**
 * Клиент Афиши: настройки из `runtimeConfig` и запрос расписания площадки.
 * HTTP не поднимаем — запросы подменяет `fakeAfisha`.
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
  widgetKey: 'widget-key',
  placeId: '125570',
  cityId: '2',
}

const SCHEDULE = {
  creationSchedules: [
    {
      creation: {
        id: 28_309,
        name: 'Сумерки. Сага. Новолуние',
        ageRestriction: 18,
        genres: '["Триллер"]',
        imageUrl: 'https://kassa.rambler.ru/poster.jpg',
        isSaleAvailable: true,
        siteLink: 'https://www.afisha.ru/movie/28309',
      },
      sessions: [{ time: '2026-11-06T22:00:00', minPrice: 670, hasAvailablePlaces: true }],
    },
  ],
  pageInfo: { hasNextPage: false },
}

describe('readAfishaSettings', () => {
  it('читает публичные ключ, площадку и город, обрезая пробелы', () => {
    const settings = readAfishaSettings({
      public: {
        afishaWidgetKey: ' widget ',
        afishaWidgetPlaceId: ' 125570 ',
        afishaWidgetCityId: ' 2 ',
      },
    })

    expect(settings).toEqual({
      widgetKey: 'widget',
      placeId: '125570',
      cityId: '2',
    })
  })

  it('пустой конфиг — пустые значения, без исключений', () => {
    expect(readAfishaSettings({})).toEqual({ widgetKey: '', placeId: '', cityId: '' })
  })
})

describe('buildAfishaFetchOptions', () => {
  it('ставит ключ виджета в X-Application-key и базу внутреннего API', () => {
    expect(buildAfishaFetchOptions(SETTINGS)).toEqual({
      baseURL: AFISHA_WIDGET_API_BASE,
      timeout: 10_000,
      headers: {
        Accept: 'application/json',
        'X-Application-key': 'widget-key',
      },
    })
  })

  it('без ключа — 503, а не запрос без авторизации', () => {
    expect(() => buildAfishaFetchOptions({ ...SETTINGS, widgetKey: '' })).toThrowError(
      expect.objectContaining({ statusCode: 503 }),
    )
  })
})

describe('fetchAfishaCinema', () => {
  it('берёт расписание площадки с размером страницы и собирает карточки', async () => {
    const { request, calls } = fakeAfisha(() => SCHEDULE)

    const data = await fetchAfishaCinema(request, SETTINGS)

    expect(calls).toEqual([{ path: '/places/125570/schedule', query: { limit: '24' } }])
    expect(data.cityId).toBe('2')
    expect(data.placeId).toBe('125570')
    expect(data.items[0]).toMatchObject({
      id: '28309',
      title: 'Сумерки. Сага. Новолуние',
      ageRating: '18+',
      sessionTime: '22:00',
      priceFrom: 670,
    })
  })

  it('без id площадки — 503: искать площадку по названию API виджета не умеет', async () => {
    const { request } = fakeAfisha(() => SCHEDULE)

    await expect(fetchAfishaCinema(request, { ...SETTINGS, placeId: '' })).rejects.toMatchObject({
      statusCode: 503,
    })
  })

  it('пустой ответ площадки — пустой список, а не ошибка', async () => {
    const { request } = fakeAfisha(() => ({}))

    const data = await fetchAfishaCinema(request, SETTINGS)

    expect(data.items).toEqual([])
  })
})
