/** Расписание ТРЦ до контракта API. Пн…Вс в порядке отображения панели. */
export const mallOpenHours = [
  { label: 'Пн', open: '10:00', close: '22:00' },
  { label: 'Вт', open: '10:00', close: '22:00' },
  { label: 'Ср', open: '10:00', close: '22:00' },
  { label: 'Чт', open: '10:00', close: '22:00' },
  { label: 'Пт', open: '10:00', close: '23:00' },
  { label: 'Сб', open: '10:00', close: '23:00' },
  { label: 'Вс', open: '10:00', close: '22:00' },
] as const

const MALL_TZ = 'Europe/Moscow'

const weekdayToIndex: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
}

/**
 * Индекс в `mallOpenHours`: Пн = 0 … Вс = 6.
 * День берём по Europe/Moscow — одинаково на SSR (UTC) и клиенте (локаль).
 */
export function mallHoursTodayIndex(date = new Date()): number {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: MALL_TZ,
    weekday: 'short',
  }).format(date)

  return weekdayToIndex[weekday] ?? 0
}

export function mallCloseToday(date = new Date()): string {
  return mallOpenHours[mallHoursTodayIndex(date)]?.close ?? '22:00'
}

export function mallHoursTodayLabel(date = new Date()): string {
  return `Сегодня с 10:00 до ${mallCloseToday(date)}`
}
