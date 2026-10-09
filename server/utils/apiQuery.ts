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

/** Slug из роута: параметр всегда строка, отсутствие отдаём пустой строкой (ручка ответит 400). */
export function readApiSlug(event: ApiEvent): string {
  const slug = getRouterParam(toQueryEvent(event), 'slug')

  return typeof slug === 'string' ? slug : ''
}
