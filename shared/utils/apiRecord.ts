/**
 * Общие примитивы разбора ответа API: мапперы принимают `unknown` и достают поля через них,
 * поэтому плоский объект, строка и путь сайта описаны в одном месте.
 */

/** Плоский объект без массивов и `null` — иначе `undefined`. */
export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

/** Строка без пробелов; всё остальное (числа, `null`, объекты) — пустая строка. */
export function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** В ссылку попадает только путь сайта: внешний URL из CMS не становится ссылкой. */
export function sitePath(value: unknown): string {
  const path = text(value)
  if (!path.startsWith('/') || path.startsWith('//')) return ''
  return path
}
