import type { ContactsHoursRange } from '#shared/types/contacts'
import type { LayoutDayHours } from '#shared/types/layout'

/**
 * Склеивает дни с одинаковым интервалом: Пн–Чт и Вс при 10:00–22:00
 * становятся «ПН-ЧТ, ВС». Так панель контактов читает семь дней недели.
 */
export function groupWeekRanges(week: readonly LayoutDayHours[]): ContactsHoursRange[] {
  const sorted = [...week].sort((a, b) => a.index - b.index)
  const groups: LayoutDayHours[][] = []

  for (const day of sorted) {
    const current = groups.find((group) => {
      const first = group[0]
      return first !== undefined && first.open === day.open && first.close === day.close
    })

    if (current) current.push(day)
    else groups.push([day])
  }

  return groups.map((days) => {
    const first = days[0]
    if (!first) {
      return { id: 'empty', days: '', time: '' }
    }

    return {
      id: `${first.open}-${first.close}-${first.index}`,
      days: formatRuns(days),
      time: `${first.open} - ${first.close}`,
    }
  })
}

function formatRuns(days: readonly LayoutDayHours[]): string {
  const runs: LayoutDayHours[][] = []

  for (const day of days) {
    const run = runs[runs.length - 1]
    const previous = run?.[run.length - 1]

    if (run && previous && day.index === previous.index + 1) run.push(day)
    else runs.push([day])
  }

  return runs
    .map((run) => {
      const start = run[0]?.label ?? ''
      const end = run[run.length - 1]?.label ?? ''
      if (!start) return ''
      if (run.length === 1) return start.toUpperCase()
      return `${start.toUpperCase()}-${end.toUpperCase()}`
    })
    .filter(Boolean)
    .join(', ')
}
