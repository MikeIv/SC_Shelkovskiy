/** Нормализует id карточки (убирает суффикс дубликата для каталога). */
export function normalizeNewsSlug(id: string): string {
  return id.replace(/-dup-\d+$/, '')
}

/** URL детальной страницы новости / акции / СМИ. */
export function getNewsDetailPath(id: string): string {
  return `/news/${normalizeNewsSlug(id)}`
}
