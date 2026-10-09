const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const

export type ApiDateParts = {
  year: number
  month: number
  day: number
}

export type FormatApiDateOptions = {
  /** «14 июля 2026» вместо «14 июля». */
  withYear?: boolean
  /** «30.05.2026» — дата альбома в галерее. */
  numeric?: boolean
}

/** Календарная дата `YYYY-MM-DD`. Невалидная дата — `undefined`, не сдвиг через `Date.parse`. */
export function parseApiDate(value: string | null | undefined): ApiDateParts | undefined {
  if (typeof value !== 'string') return undefined

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12) return undefined

  const utc = new Date(Date.UTC(year, month - 1, day))
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return undefined
  }

  return { year, month, day }
}

/**
 * Дата API в виде макета. Пустая строка, если значение не `YYYY-MM-DD`:
 * карточка не должна показывать ISO.
 */
export function formatApiDate(
  value: string | null | undefined,
  options?: FormatApiDateOptions,
): string {
  const parts = parseApiDate(value)
  if (!parts) return ''

  if (options?.numeric) {
    const day = String(parts.day).padStart(2, '0')
    const month = String(parts.month).padStart(2, '0')
    return `${day}.${month}.${parts.year}`
  }

  const label = `${parts.day} ${MONTHS_GENITIVE[parts.month - 1]}`
  return options?.withYear ? `${label} ${parts.year}` : label
}
