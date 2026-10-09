import { describe, expect, it } from 'vitest'
import { formatApiDate } from '#shared/utils/formatApiDate'
import { formatApiPeriodRange, formatApiPeriodUntil } from '#shared/utils/formatApiPeriod'

describe('formatApiDate', () => {
  it('формат карточки — день и месяц без года', () => {
    expect(formatApiDate('2026-07-14')).toBe('14 июля')
  })

  it('детальная дата добавляет год', () => {
    expect(formatApiDate('2026-07-14', { withYear: true })).toBe('14 июля 2026')
  })

  it('числовой формат галереи — ДД.ММ.ГГГГ', () => {
    expect(formatApiDate('2026-05-30', { numeric: true })).toBe('30.05.2026')
    expect(formatApiDate('2026-03-08', { numeric: true })).toBe('08.03.2026')
  })

  it('невалидная и пустая дата не превращаются в ISO', () => {
    expect(formatApiDate('2026-02-31')).toBe('')
    expect(formatApiDate('2025-02-29')).toBe('')
    expect(formatApiDate(null)).toBe('')
    expect(formatApiDate('14 июля')).toBe('')
  })

  it('високосный день принимается', () => {
    expect(formatApiDate('2024-02-29')).toBe('29 февраля')
  })
})

describe('formatApiPeriod', () => {
  it('срок акции — «до » и конец периода', () => {
    expect(formatApiPeriodUntil('2026-10-31')).toBe('до 31 октября')
  })

  it('диапазон внутри года без годов', () => {
    expect(formatApiPeriodRange('2026-08-01', '2026-09-02')).toBe('1 августа — 2 сентября')
  })

  it('диапазон через новый год показывает оба года', () => {
    expect(formatApiPeriodRange('2025-12-01', '2026-01-02')).toBe('1 декабря 2025 — 2 января 2026')
  })

  it('битая граница даёт пустую строку', () => {
    expect(formatApiPeriodUntil(null)).toBe('')
    expect(formatApiPeriodRange('2026-08-01', null)).toBe('')
  })
})
