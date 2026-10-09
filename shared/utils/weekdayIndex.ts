const weekdayToIndex: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
}

const DEFAULT_TIMEZONE = 'Europe/Moscow'

/** Пн = 0 … Вс = 6 в заданном поясе. Неизвестный пояс — Москва. */
export function weekdayIndex(timeZone: string, date = new Date()): number {
  const zone = timeZone.trim() || DEFAULT_TIMEZONE

  let weekday: string
  try {
    weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      weekday: 'short',
    }).format(date)
  } catch {
    weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: DEFAULT_TIMEZONE,
      weekday: 'short',
    }).format(date)
  }

  return weekdayToIndex[weekday] ?? 0
}

/** `YYYY-MM-DD` в заданном поясе. Неизвестный пояс — Москва. */
export function formatIsoDate(timeZone: string, date = new Date()): string {
  const zone = timeZone.trim() || DEFAULT_TIMEZONE

  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  } catch {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: DEFAULT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }
}
