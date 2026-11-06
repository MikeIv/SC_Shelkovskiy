import type { CinemaListData } from '#shared/types/cinema'
import type { HomeCinemaFilm } from '#shared/types/home'
import { asRecord, text } from '#shared/utils/apiRecord'

/**
 * Расписание площадки Афиши → карточки раздела «Кино» на главной.
 *
 * Тело — внутренний API виджета: массив `{ creation, sessions }`. В карточку идут постер,
 * название, жанры и возраст из `creation`, а `sessions` дают ближайший сеанс, цену и признаки
 * продажи. Постер обязателен, как и в моке: без картинки карточка не выводится.
 */

/** Сколько фильмов отдаём на главную: лента — тизер, весь прокат смотрит «Смотреть все». */
const MAX_ITEMS = 10

/** Сколько жанров помещается в строку карточки (макет — две строки текста). */
const MAX_GENRES = 3

/** Кроп постера под рамку карточки (372 × 560). */
const POSTER_ASPECT_RATIO = '1:2'

/** Если у фильма нет жанров — подпись как в моке. */
const FALLBACK_GENRES = 'Фильм'

/** `2026-11-06T22:00:00` — время московское, часового пояса в строке нет. */
const SESSION_TIME = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/

/** Возрастные ограничения Афиши: остальные значения в тег не выводим. */
const AGE_RATINGS = new Set([0, 6, 12, 16, 18])

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
  const creation = asRecord(record?.creation)
  if (!creation) return undefined

  const id = identifier(creation.id)
  const title = text(creation.name)
  const posterSrc = mapPosterSrc(creation)
  if (!id || !title || !posterSrc) return undefined

  const sessions = summarizeSessions(record?.sessions)
  const isOnSale = creation.isSaleAvailable === true || sessions.isOnSale
  const ticketUrl = isOnSale ? mapTicketUrl(creation.siteLink) : ''
  const ageRating = mapAgeRating(creation.ageRestriction)

  const item: HomeCinemaFilm = {
    id,
    title,
    genres: mapGenres(creation.genres),
    posterSrc,
    posterAlt: `Постер фильма «${title}»`,
    creationId: id,
    ...(isOnSale ? { onSale: true } : {}),
    ...(ageRating ? { ageRating } : {}),
    ...(ticketUrl ? { ticketUrl } : {}),
    ...(sessions.time ? { sessionTime: sessions.time } : {}),
    ...(sessions.priceFrom !== undefined ? { priceFrom: sessions.priceFrom } : {}),
  }

  return { item, startsAt: sessions.startsAt }
}

/** Постер — кроп `1:2` под рамку карточки; без кропа годится любая картинка Афиши. */
function mapPosterSrc(creation: Record<string, unknown>): string {
  const crops = creation.mainPhotoCrops
  const poster = Array.isArray(crops)
    ? crops.find((crop) => text(asRecord(crop)?.aspectRatio) === POSTER_ASPECT_RATIO)
    : undefined

  return text(asRecord(poster)?.url) || text(creation.imageUrl) || text(creation.thumbnailUrl)
}

/** Жанры приходят JSON-строкой с русскими подписями; массив тоже поддерживаем. */
function mapGenres(raw: unknown): string {
  const list = Array.isArray(raw) ? raw : parseJsonArray(text(raw))

  const labels = list.flatMap((genre) => {
    const label = text(genre) || text(asRecord(genre)?.name)
    return label ? [label] : []
  })

  const unique = [...new Set(labels)].slice(0, MAX_GENRES)

  return unique.length > 0 ? unique.join(', ') : FALLBACK_GENRES
}

function parseJsonArray(value: string): unknown[] {
  if (!value.startsWith('[')) return []

  try {
    const parsed: unknown = JSON.parse(value)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function mapAgeRating(value: unknown): string {
  const age = typeof value === 'number' ? Math.trunc(value) : Number(text(value))

  return AGE_RATINGS.has(age) ? `${age}+` : ''
}

/** Ссылка Афиши на фильм — запасной путь, если виджет покупки не поднялся. */
function mapTicketUrl(value: unknown): string {
  const url = text(value)

  return url.startsWith('https://') ? url : ''
}

function identifier(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) return String(Math.trunc(value))

  return text(value)
}

type SessionsSummary = {
  /** Ближайший сеанс по времени: фильмы сортируются по нему. */
  startsAt: number
  /** Время ближайшего сеанса `22:00` — часовой пояс в ответе уже московский. */
  time: string
  /** Минимальная цена среди сеансов, если Афиша её отдала. */
  priceFrom: number | undefined
  /** Есть свободные места хотя бы на одном сеансе. */
  isOnSale: boolean
}

/** Сеансы нужны только сводкой: без массива промежуточных объектов на каждый фильм. */
function summarizeSessions(sessions: unknown): SessionsSummary {
  const summary: SessionsSummary = {
    startsAt: Number.POSITIVE_INFINITY,
    time: '',
    priceFrom: undefined,
    isOnSale: false,
  }

  if (!Array.isArray(sessions)) return summary

  for (const session of sessions) {
    const record = asRecord(session)
    if (!record) continue

    if (record.hasAvailablePlaces === true) summary.isOnSale = true

    const price = record.minPrice
    if (typeof price === 'number' && price > 0) {
      summary.priceFrom = Math.min(summary.priceFrom ?? price, price)
    }

    const value = text(record.time)
    const startsAt = sessionTimestamp(value)
    if (startsAt === undefined || startsAt >= summary.startsAt) continue

    summary.startsAt = startsAt
    summary.time = formatSessionTime(value)
  }

  return summary
}

function sessionTimestamp(value: string): number | undefined {
  const match = SESSION_TIME.exec(value)
  if (!match) return undefined

  return Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
  )
}

function formatSessionTime(value: string): string {
  const match = SESSION_TIME.exec(value)

  return match ? `${match[4]}:${match[5]}` : ''
}
