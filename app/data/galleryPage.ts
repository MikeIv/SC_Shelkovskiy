import type { GalleryAlbum } from '#shared/types/gallery'
import { buildAlbumPhotos } from '#shared/utils/galleryPhotos'

function createAlbum(album: Omit<GalleryAlbum, 'photos'>): GalleryAlbum {
  return {
    ...album,
    photos: buildAlbumPhotos(album.imageSrc, album.photoCount),
  }
}

/** Временные альбомы до контракта API. */
export const galleryAlbums: GalleryAlbum[] = [
  createAlbum({
    id: 'miss-schelkovskiy-2026',
    title: 'Мисс Щёлковский: шоу-проект красоты, харизмы и таланта',
    date: '25.04.2026',
    imageSrc: '/images/gallery/miss-schelkovskiy.jpg',
    imageAlt: 'Мисс Щёлковский: участницы на подиуме',
    photoCount: 15,
  }),
  createAlbum({
    id: 'stars-time-party-2026',
    title: 'Stars Time Party в ТРЦ «Щёлковский» 2026',
    date: '30.05.2026',
    imageSrc: '/images/gallery/stars-time-party.jpg',
    imageAlt: 'Stars Time Party: выступление артистки на сцене',
    photoCount: 10,
  }),
  createAlbum({
    id: 'anniversary-concert-2026',
    title: 'ТРЦ «Щёлковский» 4 года! Большой концерт с участием артистов Velvet Music',
    date: '30.05.2026',
    imageSrc: '/images/gallery/anniversary-concert.jpg',
    imageAlt: 'Концерт к 4-летию ТРЦ «Щёлковский»',
    photoCount: 10,
  }),
  createAlbum({
    id: 'beauty-days-2026',
    title: 'Дни красоты и релакса в ТРЦ «Щёлковский»',
    date: '08.03.2026',
    imageSrc: '/images/gallery/beauty-days.jpg',
    imageAlt: 'Дни красоты: букет и смартфон на мероприятии',
    photoCount: 12,
  }),
  createAlbum({
    id: 'speed-dating-2026',
    title: 'Вечер быстрых свиданий в ТРЦ «Щёлковский»',
    date: '14.02.2026',
    imageSrc: '/images/gallery/speed-dating.jpg',
    imageAlt: 'Вечер быстрых свиданий: зона «Шопинг по любви»',
    photoCount: 13,
  }),
  createAlbum({
    id: 'miss-schelkovskiy-2026-repeat',
    title: 'Мисс Щёлковский: шоу-проект красоты, харизмы и таланта',
    date: '25.04.2026',
    imageSrc: '/images/gallery/miss-schelkovskiy.jpg',
    imageAlt: 'Мисс Щёлковский: участницы на подиуме',
    photoCount: 15,
  }),
]
