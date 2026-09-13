import type { HomeGalleryAlbum } from '#shared/types/home'
import { buildAlbumPhotos } from '#shared/utils/galleryPhotos'

function createAlbum(
  album: Omit<HomeGalleryAlbum, 'photos'> & { lightboxCover: string },
): HomeGalleryAlbum {
  const { lightboxCover, ...rest } = album

  return {
    ...rest,
    photos: buildAlbumPhotos(lightboxCover, album.photoCount),
  }
}

/** Временные альбомы до контракта API. */
export const homeGalleryItems: HomeGalleryAlbum[] = [
  createAlbum({
    id: 'stars-time-party-2026',
    title: 'Stars Time Party в ТРЦ «Щёлковский» 2026',
    date: '30.05.2026',
    imageSrc: '/images/gallery/stars-time-party.jpg',
    imageAlt: 'Stars Time Party в ТРЦ «Щёлковский» 2026',
    photoCount: 10,
    lightboxCover: '/images/gallery/stars-time-party.jpg',
  }),
  createAlbum({
    id: 'miss-schelkovskiy-2026',
    title: 'Мисс Щёлковский: шоу-проект красоты, харизмы и таланта',
    date: '25.04.2026',
    imageSrc: '/images/gallery/miss-schelkovskiy.jpg',
    imageAlt: 'Мисс Щёлковский: шоу-проект красоты, харизмы и таланта',
    photoCount: 15,
    lightboxCover: '/images/gallery/miss-schelkovskiy.jpg',
  }),
  createAlbum({
    id: 'beauty-show-2026',
    title: 'Дни красоты в ТРЦ «Щёлковский»',
    date: '12.04.2026',
    imageSrc: '/images/home/gallery/beauty-show.png',
    imageAlt: 'Дни красоты в ТРЦ «Щёлковский»',
    photoCount: 10,
    lightboxCover: '/images/gallery/beauty-days.jpg',
  }),
]
