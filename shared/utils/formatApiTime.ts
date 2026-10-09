/**
 * Время из API в виде макета `HH:MM`.
 * Принимает `19:00`, `19:00:00` и ISO с временем (`2026-10-02T19:00:00+03:00`).
 * Пустая строка — значение не распознано, ISO в UI не показываем.
 */
export function formatApiTime(value: string | null | undefined): string {
  if (typeof value !== 'string') return ''

  const trimmed = value.trim()
  if (!trimmed) return ''

  const plain = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(trimmed)
  if (plain) return clock(Number(plain[1]), Number(plain[2]))

  const iso = /T(\d{2}):(\d{2})/.exec(trimmed)
  if (iso) return clock(Number(iso[1]), Number(iso[2]))

  return ''
}

function clock(hours: number, minutes: number): string {
  if (hours > 23 || minutes > 59) return ''

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
