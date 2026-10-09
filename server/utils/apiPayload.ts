/**
 * Формы ответов Laravel для серверных ручек: проверка до маппинга, маппер получает `data`.
 * Тело наружу не отдаётся — это защита от «мусор прошёл валидацию».
 */
export function isItemPayload(value: unknown): value is { data: unknown } {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false

  const data = value.data
  return typeof data === 'object' && data !== null && !Array.isArray(data)
}

export function isListPayload(value: unknown): value is { data: unknown[] } {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false
  return Array.isArray(value.data)
}
