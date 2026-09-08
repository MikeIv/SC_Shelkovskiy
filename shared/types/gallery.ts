import type { HomeGalleryAlbum } from '#shared/types/home'

/** Альбом на странице галереи — карточка + набор фото для lightbox. */
export type GalleryAlbum = HomeGalleryAlbum & {
  photos: string[]
}
