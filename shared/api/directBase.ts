/**
 * Признак режима прямых запросов в Laravel: абсолютный `public.apiBase`.
 *
 * Модуль намеренно без импортов — его читает и `nuxt.config.ts`, где алиасы
 * приложения (`#shared/...`) ещё недоступны.
 */
export function isDirectApiBase(value: unknown): boolean {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim())
}
