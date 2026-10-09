import type { LayoutDayHours, LayoutHourException, LayoutHours } from '#shared/types/layout'
import { formatIsoDate, weekdayIndex } from '#shared/utils/weekdayIndex'

const CLOSED = '—'

/** Индекс сегодняшнего дня по поясу из layout. */
export function layoutTodayIndex(hours: LayoutHours, date = new Date()): number {
  return weekdayIndex(hours.timezone, date)
}

/**
 * Подпись шапки. Исключение на сегодня важнее обычной недели.
 * Пустая неделя сюда не попадает: её подменяет фолбэк до вызова.
 */
export function layoutTodayLabel(hours: LayoutHours, date = new Date()): string {
  const exception = exceptionToday(hours, date)
  if (exception?.closed) return 'Сегодня закрыто'

  const times =
    exception && exception.open && exception.close
      ? exception
      : hours.week.find((day) => day.index === layoutTodayIndex(hours, date))

  if (!times?.open || !times.close) return ''

  return `Сегодня с ${times.open} до ${times.close}`
}

/** Неделя для панели: время сегодняшнего дня заменяется исключением. */
export function layoutDisplayWeek(hours: LayoutHours, date = new Date()): LayoutDayHours[] {
  const exception = exceptionToday(hours, date)
  if (!exception) return hours.week

  const today = layoutTodayIndex(hours, date)

  return hours.week.map((day) => {
    if (day.index !== today) return day

    if (exception.closed) {
      return { ...day, open: CLOSED, close: CLOSED }
    }

    return {
      ...day,
      open: exception.open || day.open,
      close: exception.close || day.close,
    }
  })
}

function exceptionToday(hours: LayoutHours, date: Date): LayoutHourException | undefined {
  const today = formatIsoDate(hours.timezone, date)
  return hours.exceptions.find((item) => item.date === today)
}
