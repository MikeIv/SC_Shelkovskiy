import type { EventsListResponseDto } from '#shared/types/dto/events'
import type {
  EventAfishaDate,
  EventAfishaItem,
  EventDetailItem,
  EventProgramItem,
  EventsListData,
} from '#shared/types/events'
import { asRecord, sitePath, text } from '#shared/utils/apiRecord'
import { getEventDetailPath } from '#shared/utils/eventsPath'
import { MONTHS_GENITIVE, formatApiDate, parseApiDate } from '#shared/utils/formatApiDate'
import { formatApiTime } from '#shared/utils/formatApiTime'
import { mapApiListMeta } from '#shared/utils/mapApiListMeta'
import { mapApiSeo } from '#shared/utils/mapApiSeo'
import { resolveAlt } from '#shared/utils/resolveAlt'
import { sanitizeApiHtml } from '#shared/utils/sanitizeApiHtml'

const EVENT_TAG_LABEL = 'Афиша'

/** Страница афиши: карточки + `meta`. */
export function mapEventsList(dto: EventsListResponseDto): EventsListData {
  return {
    items: mapEventCards(dto.data),
    meta: mapApiListMeta(dto.meta),
  }
}

export function mapEventCards(items: readonly unknown[]): EventAfishaItem[] {
  return items.flatMap((item) => {
    const mapped = mapEventCard(item)
    return mapped ? [mapped] : []
  })
}

/** Карточка афиши. Без `starts_at` карточка не выводится: дата — обязательная часть макета. */
export function mapEventCard(item: unknown): EventAfishaItem | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const id = text(record.slug)
  const title = text(record.title)
  const dateStart = mapAfishaDate(record.starts_at)
  if (!id || !title || !dateStart) return undefined

  const dateEnd = mapAfishaDate(record.ends_at)
  /** Как и в карточке афиши: без ссылки из CMS ведём на нашу детальную мероприятия. */
  const to = sitePath(record.url) || getEventDetailPath(id)

  return {
    id,
    imageSrc: text(record.image),
    imageAlt: resolveAlt(title),
    dateStart,
    ...(dateEnd ? { dateEnd } : {}),
    tagLabel: text(record.tag) || EVENT_TAG_LABEL,
    title,
    description: plainText(text(record.preview_text)),
    to,
  }
}

/**
 * Детальная `GET /events/{slug}`: карточка + `when`, место, HTML `text`, `program`, `seo`.
 * `location` и `floor` на стенде пустые; схема `program[]` в спеке не описана — нераспознанный
 * элемент пропускается, как у `brands[]` на главной.
 */
export function mapEventDetail(data: unknown): EventDetailItem | undefined {
  const card = mapEventCard(data)
  if (!card) return undefined

  const record = asRecord(data)
  if (!record) return undefined

  const publishedAtIso = text(record.published_at)
  const publishedAt = formatApiDate(publishedAtIso, { numeric: true })
  const location = text(record.location) || text(record.floor)
  const program = mapProgram(record.program)
  const bodyHtml = sanitizeApiHtml(text(record.text))

  return {
    ...card,
    ...(publishedAt ? { publishedAt, publishedAtIso } : {}),
    when: mapWhen(record),
    ...(location ? { location } : {}),
    paragraphs: [],
    ...(program.length ? { program } : {}),
    register: record.show_subscribe_cta === true,
    ...(bodyHtml ? { bodyHtml } : {}),
    seo: mapApiSeo(record.seo),
  }
}

/** «29 сентября — 2 октября, 19:00»: даты как в моке, время добавляется, только если оно есть. */
function mapWhen(record: Record<string, unknown>): string {
  const start = formatApiDate(text(record.starts_at))
  const end = formatApiDate(text(record.ends_at))
  const range = end ? `${start} — ${end}` : start
  const time = formatApiTime(text(record.time))

  return time ? `${range}, ${time}` : range
}

function mapProgram(value: unknown): EventProgramItem[] {
  return mapItems(value, (item) => {
    const record = asRecord(item)
    if (!record) return undefined

    const time = text(record.time)
    const title = text(record.title) || text(record.name)
    if (!time || !title) return undefined

    return { time, title }
  })
}

function mapItems<T>(value: unknown, mapItem: (item: unknown) => T | undefined): T[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    const mapped = mapItem(item)
    return mapped ? [mapped] : []
  })
}

function mapAfishaDate(value: unknown): EventAfishaDate | undefined {
  const parts = parseApiDate(text(value))
  if (!parts) return undefined

  const month = MONTHS_GENITIVE[parts.month - 1]
  if (!month) return undefined

  return { day: String(parts.day), month }
}

/** Текст из HTML-поля для карточки: теги не показываем, пробелы нормализуем. */
function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
