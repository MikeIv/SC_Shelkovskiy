import type { GalleryAlbum } from '#shared/types/gallery'
import { asRecord, text } from '#shared/utils/apiRecord'
import { formatApiDate } from '#shared/utils/formatApiDate'
import { resolveAlt } from '#shared/utils/resolveAlt'

/**
 * Детальная альбома `GET /gallery/{slug}`: обложка карточки плюс фото для просмотрщика.
 *
 * Видео-элементы пропускаются: у них `src` — ссылка на плеер, а не картинка. Плеер появится
 * отдельной волной вместе со страницей `/gallery`.
 *
 * `photoCount` считаем по собранным фото, а не по `photos_count`: бейдж карточки и счётчик
 * просмотрщика должны показывать одно число. Альбом без фото возвращается с пустым набором —
 * карточка такого альбома не открывает просмотрщик.
 */
export function mapGalleryAlbumDetail(data: unknown): GalleryAlbum | undefined {
  const record = asRecord(data)
  if (!record) return undefined

  const id = text(record.slug)
  const imageSrc = text(record.cover)
  if (!id || !imageSrc) return undefined

  const title = text(record.title)
  const photos = mapAlbumPhotos(record.items)

  return {
    id,
    title,
    date: formatApiDate(text(record.date), { numeric: true }),
    imageSrc,
    imageAlt: resolveAlt(title),
    photoCount: photos.length,
    photos,
  }
}

function mapAlbumPhotos(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    const record = asRecord(item)
    if (!record || text(record.type) !== 'image') return []

    const src = text(record.src)

    return src ? [src] : []
  })
}
