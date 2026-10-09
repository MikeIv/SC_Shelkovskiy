import { describe, expect, it } from 'vitest'
import { formatApiTime } from '#shared/utils/formatApiTime'

describe('formatApiTime', () => {
  it('приводит время из API к HH:MM', () => {
    expect(formatApiTime('19:00')).toBe('19:00')
    expect(formatApiTime(' 9:05 ')).toBe('09:05')
    expect(formatApiTime('19:00:00')).toBe('19:00')
    expect(formatApiTime('2026-10-02T19:00:00+03:00')).toBe('19:00')
  })

  it('не показывает мусор вместо времени', () => {
    expect(formatApiTime(null)).toBe('')
    expect(formatApiTime(undefined)).toBe('')
    expect(formatApiTime('')).toBe('')
    expect(formatApiTime('25:00')).toBe('')
    expect(formatApiTime('19:70')).toBe('')
    expect(formatApiTime('вечер')).toBe('')
    expect(formatApiTime('2026-10-02')).toBe('')
  })
})
