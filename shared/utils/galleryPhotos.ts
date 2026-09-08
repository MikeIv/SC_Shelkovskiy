/** Пул обложек для временных альбомов до контракта API. */
export const GALLERY_PHOTO_POOL = [
  '/images/gallery/miss-schelkovskiy.jpg',
  '/images/gallery/stars-time-party.jpg',
  '/images/gallery/anniversary-concert.jpg',
  '/images/gallery/beauty-days.jpg',
  '/images/gallery/speed-dating.jpg',
] as const

/** Обложка первой, далее цикл пула. */
export function buildAlbumPhotos(
  cover: string,
  count: number,
  pool: readonly string[] = GALLERY_PHOTO_POOL,
): string[] {
  const sources = [cover, ...pool.filter((src) => src !== cover)]

  return Array.from({ length: count }, (_, index) => sources[index % sources.length] ?? cover)
}
