import type { ApiEvent } from './apiEvent'

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
  const slug = getRouterParam(event, 'slug')

  return typeof slug === 'string' ? slug : ''
}
