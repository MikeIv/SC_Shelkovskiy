/**
 * Элемент альбома `items[]`: фото или видео.
 * У фото `src` — картинка; у видео `src` — ссылка на плеер Rutube, а `preview` — обложка.
 */
export type GalleryItemDto = {
  type: string | null
  src: string | null
  preview: string | null
}

/**
 * Тело `GET /gallery/{slug}`.
 * `photos_count` считает только фото — у альбома с одним видео он нулевой, а `has_video` истинный.
 */
export type GalleryAlbumResponseDto = {
  data: {
    slug: string | null
    title: string | null
    date: string | null
    cover: string | null
    photos_count: number | null
    has_video: boolean | null
    items: GalleryItemDto[]
  }
}
