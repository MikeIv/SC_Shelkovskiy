import { describe, expect, it } from 'vitest'
import type { CinemaListData } from '#shared/types/cinema'
import { mapAfishaSchedule } from '#shared/utils/mappers/afisha'

/**
 * Расписание площадки Афиши → карточки раздела «Кино».
 *
 * Фикстуры повторяют ответ внутреннего API виджета как есть: `genres` приходит JSON-строкой,
 * `ageRestriction` — числом, `time` — без часового пояса.
 */

const CONTEXT = { cityId: '2', placeId: '125570' }

function schedule(
  overrides: {
    id?: number
    name?: string
    genres?: unknown
    age?: unknown
    crops?: unknown
    imageUrl?: unknown
    siteLink?: unknown
    isSaleAvailable?: boolean
    sessions?: unknown
  } = {},
): unknown {
  return {
    creation: {
      id: overrides.id ?? 28_309,
      name: overrides.name ?? 'Сумерки. Сага. Новолуние',
      type: 'movie',
      ageRestriction: overrides.age ?? 18,
      genres: overrides.genres ?? '["Триллер","Фэнтези","Фильмы","Мелодрама"]',
      imageUrl: overrides.imageUrl ?? 'https://kassa.rambler.ru/poster.jpg',
      mainPhotoCrops: overrides.crops ?? [
        {
          aspectRatio: '1:2',
          url: 'https://img07.rl0.ru/kassa/poster-1x2.jpg',
        },
        { aspectRatio: '7:4', url: 'https://img05.rl0.ru/kassa/frame-7x4.jpg' },
      ],
      isSaleAvailable: overrides.isSaleAvailable ?? true,
      siteLink: overrides.siteLink ?? 'https://www.afisha.ru/movie/28309',
    },
    sessions: overrides.sessions ?? [
      { id: 137_422_121, time: '2026-11-06T22:00:00', minPrice: 670, hasAvailablePlaces: true },
    ],
  }
}

describe('mapAfishaSchedule', () => {
  it('собирает карточку с постером-кропом, жанрами, возрастом, сеансом и ценой', () => {
    const data = mapAfishaSchedule([schedule()], CONTEXT)

    expect(data).toEqual<CinemaListData>({
      cityId: '2',
      placeId: '125570',
      items: [
        {
          id: '28309',
          title: 'Сумерки. Сага. Новолуние',
          genres: 'Триллер, Фэнтези, Фильмы',
          posterSrc: 'https://img07.rl0.ru/kassa/poster-1x2.jpg',
          posterAlt: 'Постер фильма «Сумерки. Сага. Новолуние»',
          ageRating: '18+',
          creationId: '28309',
          onSale: true,
          ticketUrl: 'https://www.afisha.ru/movie/28309',
          sessionTime: '22:00',
          priceFrom: 670,
        },
      ],
    })
  })

  it('без кропа 1:2 берёт общую картинку Афиши, без картинок — карточку пропускает', () => {
    const withImage = mapAfishaSchedule(
      [schedule({ crops: [{ aspectRatio: '7:4', url: 'https://img05.rl0.ru/frame.jpg' }] })],
      CONTEXT,
    )
    const withoutImages = mapAfishaSchedule([schedule({ crops: [], imageUrl: '' })], CONTEXT)

    expect(withImage.items[0]?.posterSrc).toBe('https://kassa.rambler.ru/poster.jpg')
    expect(withoutImages.items).toEqual([])
  })

  it('без названия или id карточка не выводится', () => {
    expect(mapAfishaSchedule([schedule({ name: '  ' })], CONTEXT).items).toEqual([])
    expect(mapAfishaSchedule([{ creation: null, sessions: [] }], CONTEXT).items).toEqual([])
  })

  it('незнакомые жанры схлопываются в подпись «Фильм», возраст вне списка — тега нет', () => {
    const [item] = mapAfishaSchedule([schedule({ genres: '[]', age: 21 })], CONTEXT).items

    expect(item?.genres).toBe('Фильм')
    expect(item?.ageRating).toBeUndefined()
  })

  it('жанры без повторов и не длиннее трёх', () => {
    const [item] = mapAfishaSchedule(
      [schedule({ genres: '["Комедия","Комедия","Приключение","Фэнтези"]' })],
      CONTEXT,
    ).items

    expect(item?.genres).toBe('Комедия, Приключение, Фэнтези')
  })

  it('без продажи и без мест на сеансах — нет ссылки и кнопка неактивна', () => {
    const [closed] = mapAfishaSchedule(
      [
        schedule({
          isSaleAvailable: false,
          sessions: [{ time: '2026-11-06T22:00:00', minPrice: 670, hasAvailablePlaces: false }],
        }),
      ],
      CONTEXT,
    ).items

    expect(closed?.onSale).toBeUndefined()
    expect(closed?.ticketUrl).toBeUndefined()
  })

  it('свободные места на сеансе включают продажу, даже если флаг произведения снят', () => {
    const [item] = mapAfishaSchedule([schedule({ isSaleAvailable: false })], CONTEXT).items

    expect(item?.onSale).toBe(true)
  })

  it('ближайший сеанс задаёт время, цену и порядок карточек', () => {
    const entries = [
      schedule({
        id: 1,
        name: 'Поздний',
        sessions: [
          { time: '2026-11-06T23:30:00', minPrice: 800, hasAvailablePlaces: true },
          { time: '2026-11-06T21:15:00', minPrice: 500, hasAvailablePlaces: true },
        ],
      }),
      schedule({
        id: 2,
        name: 'Ранний',
        sessions: [{ time: '2026-11-06T10:00:00', minPrice: 300, hasAvailablePlaces: true }],
      }),
    ]

    const { items } = mapAfishaSchedule(entries, CONTEXT)

    expect(items.map((item) => item.title)).toEqual(['Ранний', 'Поздний'])
    expect(items[1]).toMatchObject({ sessionTime: '21:15', priceFrom: 500 })
  })

  it('фильмы обрезаются до десяти', () => {
    const entries = Array.from({ length: 12 }, (_, index) =>
      schedule({
        id: index,
        name: `Фильм ${index}`,
        sessions: [
          {
            time: `2026-11-${String(20 - index).padStart(2, '0')}T18:00:00`,
            minPrice: 400,
            hasAvailablePlaces: true,
          },
        ],
      }),
    )

    const { items } = mapAfishaSchedule(entries, CONTEXT)

    expect(items).toHaveLength(10)
    expect(items[0]?.title).toBe('Фильм 11')
  })

  it('без города и площадки контекст остаётся пустым — виджет покупки не соберётся', () => {
    const data = mapAfishaSchedule([schedule()], { cityId: '', placeId: '' })

    expect(data.cityId).toBeNull()
    expect(data.placeId).toBeNull()
  })
})
