import { describe, expect, it } from 'vitest'
import type { CinemaListData } from '#shared/types/cinema'
import { mapAfishaSchedule } from '#shared/utils/mappers/afisha'

/**
 * Расписание площадки Афиши → карточки раздела «Кино».
 *
 * Перечисления вендор отдаёт текстом (`"Movie"`, `"Audience18"`), хотя в swagger они целые —
 * поэтому фикстуры повторяют ответ как есть, строками.
 */

const CONTEXT = { cityId: '2', placeId: '4242' }

function schedule(
  overrides: {
    id?: string
    name?: string
    genres?: unknown
    age?: unknown
    images?: unknown
    afishaUrl?: unknown
    sessions?: unknown
  } = {},
): unknown {
  return {
    Creation: {
      Id: overrides.id ?? '989798',
      Type: 'Movie',
      Name: overrides.name ?? 'Кодекс Данте',
      Genres: overrides.genres ?? ['Mystery', 'DramaFilms', 'Thrillers'],
      AgeRestriction: overrides.age ?? 'Audience18',
      Images: overrides.images ?? [
        { Url: 'https://cdn.afisha.ru/poster.jpg', Type: 'Poster' },
        { Url: 'https://cdn.afisha.ru/frame.jpg', Type: 'Frame' },
      ],
      AfishaCreationUrl: overrides.afishaUrl ?? 'https://www.afisha.ru/movie/kodeks-dante/',
    },
    Sessions: overrides.sessions ?? [
      { Id: 1, IsSaleAvailable: true, SessionDateTime: '2026-11-01T18:00:00+03:00' },
    ],
  }
}

describe('mapAfishaSchedule', () => {
  it('собирает карточку из постера, жанров и возрастного ограничения', () => {
    const data = mapAfishaSchedule([schedule()], CONTEXT)

    expect(data).toEqual<CinemaListData>({
      cityId: '2',
      placeId: '4242',
      items: [
        {
          id: '989798',
          title: 'Кодекс Данте',
          genres: 'Детектив, Драма, Триллер',
          posterSrc: 'https://cdn.afisha.ru/poster.jpg',
          posterAlt: 'Постер фильма «Кодекс Данте»',
          ageRating: '18+',
          creationId: '989798',
          onSale: true,
          ticketUrl: 'https://www.afisha.ru/movie/kodeks-dante/',
        },
      ],
    })
  })

  it('без постер-картинки берёт первое изображение, без изображений — карточку пропускает', () => {
    const withFrame = mapAfishaSchedule(
      [schedule({ images: [{ Url: 'https://cdn.afisha.ru/frame.jpg', Type: 'Frame' }] })],
      CONTEXT,
    )
    const withoutImages = mapAfishaSchedule([schedule({ images: [] })], CONTEXT)

    expect(withFrame.items[0]?.posterSrc).toBe('https://cdn.afisha.ru/frame.jpg')
    expect(withoutImages.items).toEqual([])
  })

  it('без названия или id карточка не выводится', () => {
    expect(mapAfishaSchedule([schedule({ name: '  ' })], CONTEXT).items).toEqual([])
    expect(mapAfishaSchedule([{ Creation: null, Sessions: [] }], CONTEXT).items).toEqual([])
  })

  it('незнакомые жанры схлопываются в подпись «Фильм», возраст неизвестен — тега нет', () => {
    const [item] = mapAfishaSchedule(
      [schedule({ genres: ['A3250'], age: 'Unknown' })],
      CONTEXT,
    ).items

    expect(item?.genres).toBe('Фильм')
    expect(item?.ageRating).toBeUndefined()
  })

  it('жанры без повторов и не длиннее трёх', () => {
    const [item] = mapAfishaSchedule(
      [schedule({ genres: ['Comedies', 'Comedies', 'Adventure', 'Fantasy', 'Anime'] })],
      CONTEXT,
    ).items

    expect(item?.genres).toBe('Комедия, Приключение, Фэнтези')
  })

  it('ссылка на билеты — только когда есть сеанс в продаже', () => {
    const [onSale] = mapAfishaSchedule([schedule()], CONTEXT).items
    const [closed] = mapAfishaSchedule(
      [
        schedule({
          sessions: [
            { Id: 1, IsSaleAvailable: false, SessionDateTime: '2026-11-01T18:00:00+03:00' },
          ],
        }),
      ],
      CONTEXT,
    ).items

    expect(onSale?.ticketUrl).toBeDefined()
    expect(closed?.onSale).toBeUndefined()
    expect(closed?.ticketUrl).toBeUndefined()
  })

  it('фильмы идут по ближайшему сеансу и обрезаются до десяти', () => {
    const entries = Array.from({ length: 12 }, (_, index) =>
      schedule({
        id: String(index),
        name: `Фильм ${index}`,
        sessions: [
          {
            Id: index,
            IsSaleAvailable: true,
            SessionDateTime: `2026-11-${String(20 - index).padStart(2, '0')}T18:00:00+03:00`,
          },
        ],
      }),
    )

    const { items } = mapAfishaSchedule(entries, CONTEXT)

    expect(items).toHaveLength(10)
    expect(items[0]?.title).toBe('Фильм 11')
    expect(items[9]?.title).toBe('Фильм 2')
  })

  it('без города и площадки контекст остаётся пустым — виджет покупки не соберётся', () => {
    const data = mapAfishaSchedule([schedule()], { cityId: '', placeId: '' })

    expect(data.cityId).toBeNull()
    expect(data.placeId).toBeNull()
  })
})
