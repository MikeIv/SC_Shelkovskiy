/** Убирает суффикс дубликата карточки (`-2`). */
export function normalizeAwardsSlug(id: string): string {
  return id.endsWith('-2') ? id.slice(0, -2) : id
}

/** URL детальной страницы награды / социальной активности. */
export function getAwardsDetailPath(id: string): string {
  return `/awards/${id}`
}
