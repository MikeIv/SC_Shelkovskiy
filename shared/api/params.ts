import { ApiContractError } from './errors'

/**
 * Чтение query-параметров ручек. Логика чистая: её одинаково вызывают
 * серверная ручка Nitro и клиент в режиме прямых запросов к Laravel.
 */

/**
 * Числовой query-параметр. Не распознан или вне границ — 400,
 * чтобы запрос не уходил в API с мусором.
 *
 * Принимаем и строку (URL, `getQuery`), и число: императивные вызовы
 * («показать ещё») передают `page` и `per_page` уже посчитанными.
 */
export function readNumberParam(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
  message: string,
): number {
  if (value === undefined || value === null || value === '') return fallback

  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new ApiContractError(400, message)
  }

  return parsed
}

/** Slug из пути детальной ручки: пусто — 400 (раньше это делала серверная ручка). */
export function readSlugParam(value: unknown, message: string): string {
  if (typeof value !== 'string' || value === '') {
    throw new ApiContractError(400, message)
  }

  return value
}
