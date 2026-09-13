import type { HomeCinemaFilm } from '#shared/types/home'

/** Временные карточки до контракта API и билетного сервиса. */
export const homeCinemaItems: HomeCinemaFilm[] = [
  {
    id: 'kodeks-dante',
    title: 'Кодекс Данте',
    genres: 'Детектив, Фильмы, Драма',
    posterSrc: '/images/home/cinema/kodeks-dante.png',
    posterAlt: 'Постер фильма «Кодекс Данте»',
    ageRating: '18+',
  },
  {
    id: 'obsessiya',
    title: 'Обсессия',
    genres: 'Фильмы, Ужасы',
    posterSrc: '/images/home/cinema/obsessiya.png',
    posterAlt: 'Постер фильма «Обсессия»',
    ageRating: '18+',
  },
  {
    id: 'maykl',
    title: 'Майкл',
    genres: 'Фильмы, Биография, Исторический',
    posterSrc: '/images/home/cinema/maykl.png',
    posterAlt: 'Постер фильма «Майкл»',
    ageRating: '18+',
  },
  {
    id: 'tri-bogatyrya',
    title: 'Три богатыря. Ни дня без подвига 3',
    genres: 'Мультфильм, Приключение, Комедия',
    posterSrc: '/images/home/cinema/tri-bogatyrya.png',
    posterAlt: 'Постер мультфильма «Три богатыря. Ни дня без подвига 3»',
    ageRating: '6+',
  },
  {
    id: 'holop-3',
    title: 'Холоп 3',
    genres: 'Фильмы, Приключение, Комедия',
    posterSrc: '/images/home/cinema/holop-3.png',
    posterAlt: 'Постер фильма «Холоп 3»',
    ageRating: '16+',
  },
]
