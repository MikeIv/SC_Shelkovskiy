import type { ApiEvent } from './apiEvent'

/**
 * Автоимпорты `getQuery` / `getRouterParam` могут указывать на другую копию `h3`,
 * чем `ApiEvent`. Приведение только на этой границе: в рантайме событие одно.
 */
type QueryEvent = Parameters<typeof getQuery>[0]

function toQueryEvent(event: ApiEvent): QueryEvent {
  return event as unknown as QueryEvent
}

/** Query ручки. Читать через эту обёртку, а не через `getQuery` напрямую. */
export function readApiQuery(event: ApiEvent) {
  return getQuery(toQueryEvent(event))
}

/**
 * Числовой query-параметр серверных ручек. Не распознан или вне границ — 400,
 * чтобы прокси не ходил в upstream с мусором.
 */
export function readApiNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
  message: string,
): number {
  if (value === undefined || value === null || value === '') return fallback

  const parsed = typeof value === 'string' ? Number(value) : Number.NaN

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw createError({
      statusCode: 400,
      statusMessage: message,
    })
  }

  return parsed
}

/** Slug из роута: параметр всегда строка, отсутствие отдаём пустой строкой (ручка ответит 400). */
export function readApiSlug(event: ApiEvent): string {
  const slug = getRouterParam(toQueryEvent(event), 'slug')

  return typeof slug === 'string' ? slug : ''
}
