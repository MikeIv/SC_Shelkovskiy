import { describe, expect, it } from 'vitest'
import type { GalleryAlbumResponseDto } from '#shared/types/dto/gallery'
import { mapGalleryAlbumDetail } from '#shared/utils/mappers/gallery'

/**
 * Ответ `/gallery/{slug}`: фото-элементы плюс видео, у которого `src` — ссылка на плеер.
 * Именно из-за него бейдж карточки и просмотрщик раньше расходились.
 */
function albumData(
  overrides: Partial<GalleryAlbumResponseDto['data']> = {},
): GalleryAlbumResponseDto['data'] {
  return {
    slug: 'stars-time-party-2026',
    title: 'Stars Time Party',
    date: '2026-05-30',
    cover: '/storage/episode/cover.jpg',
    photos_count: 2,
    has_video: false,
    items: [
      { type: 'image', src: '/storage/media-gallery/a.jpg', preview: null },
      { type: 'image', src: '/storage/media-gallery/b.jpg', preview: null },
    ],
    ...overrides,
  }
}

describe('mapGalleryAlbumDetail', () => {
  it('собирает фото из items и считает их число по набору', () => {
    const album = mapGalleryAlbumDetail(albumData())

    expect(album).toEqual({
      id: 'stars-time-party-2026',
      title: 'Stars Time Party',
      date: '30.05.2026',
      imageSrc: '/storage/episode/cover.jpg',
      imageAlt: 'Stars Time Party',
      photoCount: 2,
      photos: ['/storage/media-gallery/a.jpg', '/storage/media-gallery/b.jpg'],
    })
  })

  it('видео-элемент не становится фото: у него ссылка на плеер вместо картинки', () => {
    const album = mapGalleryAlbumDetail(
      albumData({
        photos_count: 0,
        has_video: true,
        items: [
          {
            type: 'video',
            src: 'https://rutube.ru/video/105e79cf8a523855abe7ab53621247b0/',
            preview: '/storage/media-gallery/poster.jpg',
          },
        ],
      }),
    )

    expect(album?.photoCount).toBe(0)
    expect(album?.photos).toEqual([])
  })

  it('пропускает элемент без src и с чужим типом', () => {
    const album = mapGalleryAlbumDetail(
      albumData({
        items: [
          { type: 'image', src: '   ', preview: null },
          { type: null, src: '/storage/media-gallery/c.jpg', preview: null },
          { type: 'image', src: '  /storage/media-gallery/d.jpg  ', preview: null },
        ],
      }),
    )

    expect(album?.photos).toEqual(['/storage/media-gallery/d.jpg'])
  })

  it('альбом без slug или обложки не выводится', () => {
    expect(mapGalleryAlbumDetail(albumData({ slug: ' ' }))).toBeUndefined()
    expect(mapGalleryAlbumDetail(albumData({ cover: '' }))).toBeUndefined()
    expect(mapGalleryAlbumDetail(null)).toBeUndefined()
  })

  it('items не массив — альбом без набора фото', () => {
    const album = mapGalleryAlbumDetail(albumData({ items: undefined as never }))

    expect(album?.photoCount).toBe(0)
    expect(album?.photos).toEqual([])
  })
})
