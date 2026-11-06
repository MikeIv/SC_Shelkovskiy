import type { CinemaListData } from '#shared/types/cinema'
import type { HomeCinemaFilm } from '#shared/types/home'
import { asRecord, text } from '#shared/utils/apiRecord'

/**
 * Афиша API → карточки раздела «Кино» на главной.
 *
 * Тело `GET /v3/places/{id}/schedule` — массив `{ Creation, Sessions[] }`; в карточку идут
 * название, постер, жанры и возраст из `Creation`, а `Sessions` нужны, чтобы понять,
 * есть ли продажа билетов. Постер обязателен, как и в моке: без картинки карточка не выводится.
 */

/** Сколько фильмов отдаём на главную: лента — тизер, весь прокат смотрит «Смотреть все». */
const MAX_ITEMS = 10

/** Сколько жанров помещается в строку карточки (макет — две строки текста). */
const MAX_GENRES = 3

const POSTER_TYPE = 'Poster'

/** Если у фильма нет жанров из известного списка — подпись как в моке. */
const FALLBACK_GENRES = 'Фильм'

/** `Models.V3.Shared.Genre` — значения приходят текстом, подписи по макету. */
const GENRE_LABELS: Record<string, string> = {
  ActionFilms: 'Боевик',
  Adventure: 'Приключение',
  Anime: 'Аниме',
  Biopics: 'Биография',
  Cartoons: 'Мультфильм',
  Comedies: 'Комедия',
  ComedyDramas: 'Трагикомедия',
  Crime: 'Криминальный',
  Documentaries: 'Документальный',
  DramaFilms: 'Драма',
  Fantasy: 'Фэнтези',
  HistoricalFilms: 'Исторический',
  HorrorMovies: 'Ужасы',
  Melodramas: 'Мелодрама',
  Musical: 'Музыкальный',
  Mystery: 'Детектив',
  Mystical: 'Мистика',
  Noir: 'Нуар',
  Romance: 'Ромком',
  Scifi: 'Фантастика',
  ScreenAdaptations: 'Экранизация',
  Shorts: 'Короткометражный',
  SportFilm: 'Спортивный',
  Thrillers: 'Триллер',
  UndubbedFilms: 'Недублированный',
  War: 'Военный',
  Westerns: 'Вестерн',
}

/** `Models.V3.Shared.AgeRestriction` — значение enum → подпись в углу постера. */
const AGE_RATINGS: Record<string, string> = {
  Audience0: '0+',
  Audience12: '12+',
  Audience14: '14+',
  Audience16: '16+',
  Audience18: '18+',
  Audience3: '3+',
  Audience6: '6+',
}

export type AfishaCinemaContext = {
  cityId: string
  placeId: string
}

/** Расписание площадки → данные раздела: по фильму на карточку, ближайшие сеансы первыми. */
export function mapAfishaSchedule(
  schedule: readonly unknown[],
  context: AfishaCinemaContext,
): CinemaListData {
  const films = schedule.flatMap((entry) => {
    const film = mapFilm(entry)
    return film ? [film] : []
  })

  films.sort((left, right) => left.startsAt - right.startsAt)

  return {
    cityId: context.cityId || null,
    placeId: context.placeId || null,
    items: films.slice(0, MAX_ITEMS).map((film) => film.item),
  }
}

type DatedFilm = { item: HomeCinemaFilm; startsAt: number }

function mapFilm(entry: unknown): DatedFilm | undefined {
  const record = asRecord(entry)
  const creation = asRecord(record?.Creation)
  if (!creation) return undefined

  const id = text(creation.Id)
  const title = text(creation.Name)
  const posterSrc = mapPosterSrc(creation.Images)
  if (!id || !title || !posterSrc) return undefined

  const sessions = summarizeSessions(record?.Sessions)
  const ticketUrl = sessions.isOnSale ? text(creation.AfishaCreationUrl) : ''
  const ageRating = AGE_RATINGS[text(creation.AgeRestriction)]

  const item: HomeCinemaFilm = {
    id,
    title,
    genres: mapGenres(creation.Genres),
    posterSrc,
    posterAlt: `Постер фильма «${title}»`,
    creationId: id,
    ...(sessions.isOnSale ? { onSale: true } : {}),
    ...(ageRating ? { ageRating } : {}),
    ...(ticketUrl ? { ticketUrl } : {}),
  }

  return { item, startsAt: sessions.startsAt }
}

/** Постер — `Images[Type=Poster]`; если вендор его не отдал, годится любое изображение. */
function mapPosterSrc(images: unknown): string {
  if (!Array.isArray(images)) return ''

  const poster = images.find((image) => text(asRecord(image)?.Type) === POSTER_TYPE)
  const first = poster ?? images[0]

  return text(asRecord(first)?.Url)
}

function mapGenres(genres: unknown): string {
  if (!Array.isArray(genres)) return FALLBACK_GENRES

  const labels = genres.flatMap((genre) => {
    const label = GENRE_LABELS[text(genre)]
    return label ? [label] : []
  })

  const unique = [...new Set(labels)].slice(0, MAX_GENRES)

  return unique.length > 0 ? unique.join(', ') : FALLBACK_GENRES
}

type SessionsSummary = {
  /** Ближайший сеанс по часам сервера: фильмы сортируются по нему. */
  startsAt: number
  /** Есть хотя бы один сеанс в продаже — от этого зависит кнопка «Купить билет». */
  isOnSale: boolean
}

/** Сеансы нужны только сводкой: без массива промежуточных объектов на каждый фильм. */
function summarizeSessions(sessions: unknown): SessionsSummary {
  const summary: SessionsSummary = { startsAt: Number.POSITIVE_INFINITY, isOnSale: false }

  if (!Array.isArray(sessions)) return summary

  for (const session of sessions) {
    const record = asRecord(session)
    if (!record) continue

    const startsAt = Date.parse(text(record.SessionDateTime))
    if (!Number.isNaN(startsAt)) {
      summary.startsAt = Math.min(summary.startsAt, startsAt)
    }

    if (record.IsSaleAvailable === true) summary.isOnSale = true
  }

  return summary
}
