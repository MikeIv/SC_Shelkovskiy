import { formatApiDate, parseApiDate } from '#shared/utils/formatApiDate'

/** Срок акции на карточке: «до 31 октября». */
export function formatApiPeriodUntil(value: string | null | undefined): string {
  const label = formatApiDate(value)
  return label ? `до ${label}` : ''
}

/**
 * Диапазон на детальной (волна 4): «1 августа — 2 сентября».
 * Год добавляется, только если границы в разных годах.
 */
export function formatApiPeriodRange(
  from: string | null | undefined,
  to: string | null | undefined,
): string {
  const start = parseApiDate(from)
  const end = parseApiDate(to)
  if (!start || !end) return ''

  const withYear = start.year !== end.year
  const left = formatApiDate(from, { withYear })
  const right = formatApiDate(to, { withYear })
  return `${left} — ${right}`
}
