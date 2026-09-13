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

/** Индекс в `mallOpenHours`: Пн = 0 … Вс = 6. */
export function mallHoursTodayIndex(date = new Date()): number {
  return (date.getDay() + 6) % 7
}

export function mallCloseToday(date = new Date()): string {
  return mallOpenHours[mallHoursTodayIndex(date)]?.close ?? '22:00'
}

export function mallHoursTodayLabel(date = new Date()): string {
  return `Сегодня с 10:00 до ${mallCloseToday(date)}`
}
