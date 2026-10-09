import { describe, expect, it } from 'vitest'
import type { LayoutHours } from '#shared/types/layout'
import { layoutDisplayWeek, layoutTodayIndex, layoutTodayLabel } from '#shared/utils/layoutHours'
import { formatIsoDate, weekdayIndex } from '#shared/utils/weekdayIndex'

/** Пятница, 12:00 по Москве. */
const FRIDAY = new Date('2026-10-09T12:00:00+03:00')

const hours: LayoutHours = {
  timezone: 'Europe/Moscow',
  week: [
    { index: 0, label: 'Пн', open: '10:00', close: '22:00' },
    { index: 1, label: 'Вт', open: '10:00', close: '22:00' },
    { index: 2, label: 'Ср', open: '10:00', close: '22:00' },
    { index: 3, label: 'Чт', open: '10:00', close: '22:00' },
    { index: 4, label: 'Пт', open: '10:00', close: '23:00' },
    { index: 5, label: 'Сб', open: '10:00', close: '23:00' },
    { index: 6, label: 'Вс', open: '10:00', close: '22:00' },
  ],
  exceptions: [],
  tenants: [],
}

describe('weekdayIndex', () => {
  it('считает день недели в поясе ручки', () => {
    expect(weekdayIndex('Europe/Moscow', FRIDAY)).toBe(4)
  })

  it('пустой и неизвестный пояс читает по Москве', () => {
    expect(weekdayIndex('', FRIDAY)).toBe(weekdayIndex('Europe/Moscow', FRIDAY))
    expect(weekdayIndex('Nowhere/Zone', FRIDAY)).toBe(weekdayIndex('Europe/Moscow', FRIDAY))
  })
})

describe('formatIsoDate', () => {
  it('отдаёт дату в поясе ручки, а не в UTC', () => {
    const late = new Date('2026-10-09T22:30:00Z')

    expect(formatIsoDate('UTC', late)).toBe('2026-10-09')
    expect(formatIsoDate('Europe/Moscow', late)).toBe('2026-10-10')
  })

  it('неизвестный пояс читает по Москве', () => {
    expect(formatIsoDate('Nowhere/Zone', FRIDAY)).toBe(formatIsoDate('Europe/Moscow', FRIDAY))
  })
})

describe('layoutTodayIndex', () => {
  it('берёт пояс из ответа ручки', () => {
    expect(layoutTodayIndex(hours, FRIDAY)).toBe(4)
    expect(layoutTodayIndex({ ...hours, timezone: 'UTC' }, FRIDAY)).toBe(4)
  })
})

describe('layoutDisplayWeek', () => {
  it('без исключений отдаёт неделю как есть', () => {
    expect(layoutDisplayWeek(hours, FRIDAY)).toEqual(hours.week)
  })

  it('заменяет сегодняшний день исключением с другими часами', () => {
    const week = layoutDisplayWeek(
      {
        ...hours,
        exceptions: [{ date: '2026-10-09', open: '12:00', close: '18:00', closed: false }],
      },
      FRIDAY,
    )

    expect(week.find((day) => day.index === 4)).toEqual({
      index: 4,
      label: 'Пт',
      open: '12:00',
      close: '18:00',
    })
    expect(week.find((day) => day.index === 5)?.open).toBe('10:00')
  })

  it('закрытый день помечает прочерком', () => {
    const week = layoutDisplayWeek(
      { ...hours, exceptions: [{ date: '2026-10-09', open: '', close: '', closed: true }] },
      FRIDAY,
    )

    expect(week.find((day) => day.index === 4)?.open).toBe('—')
    expect(week.find((day) => day.index === 4)?.close).toBe('—')
  })
})

describe('layoutTodayLabel', () => {
  it('собирает подпись из сегодняшнего дня недели', () => {
    expect(layoutTodayLabel(hours, FRIDAY)).toBe('Сегодня с 10:00 до 23:00')
  })

  it('исключение важнее недели', () => {
    const withException: LayoutHours = {
      ...hours,
      exceptions: [{ date: '2026-10-09', open: '12:00', close: '18:00', closed: false }],
    }

    expect(layoutTodayLabel(withException, FRIDAY)).toBe('Сегодня с 12:00 до 18:00')
  })

  it('закрытый день и пустая неделя не дают подписи о часах', () => {
    const closed: LayoutHours = {
      ...hours,
      exceptions: [{ date: '2026-10-09', open: '', close: '', closed: true }],
    }

    expect(layoutTodayLabel(closed, FRIDAY)).toBe('Сегодня закрыто')
    expect(layoutTodayLabel({ ...hours, week: [] }, FRIDAY)).toBe('')
  })
})
