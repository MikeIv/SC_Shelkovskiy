import { describe, expect, it } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import type { HomeGalleryAlbum } from '#shared/types/home'
import { GalleryAlbumProbe } from './support/GalleryAlbumProbe'

/**
 * Альбом, как его отдаёт карточка главной: обложка в `photos` плюс число фото из `photos_count`.
 * Догрузка по клику должна довести набор до этого числа.
 */
function album(overrides: Partial<HomeGalleryAlbum> = {}): HomeGalleryAlbum {
  return {
    id: 'party',
    title: 'Вечеринка',
    date: '30.05.2026',
    imageSrc: '/storage/episode/cover.jpg',
    imageAlt: 'Вечеринка',
    photoCount: 3,
    photos: ['/storage/episode/cover.jpg'],
    ...overrides,
  }
}

describe('useGalleryAlbum', () => {
  it('догружает фото альбома, когда в карточке только обложка', async () => {
    registerEndpoint('/api/gallery/party', () => ({
      data: { photos: ['/a.jpg', '/b.jpg', '/c.jpg'] },
    }))

    const wrapper = await mountSuspended(GalleryAlbumProbe, { props: { album: album() } })

    expect(wrapper.attributes('data-count')).toBe('3')
    expect(wrapper.attributes('data-photos')).toBe('/a.jpg,/b.jpg,/c.jpg')
    expect(wrapper.attributes('data-pending')).toBe('false')
  })

  it('не ходит в API, если обложка уже покрывает набор', async () => {
    /** Ответ с другим файлом: если запрос всё же уйдёт, тест это увидит. */
    registerEndpoint('/api/gallery/single', () => ({ data: { photos: ['/api.jpg'] } }))

    const wrapper = await mountSuspended(GalleryAlbumProbe, {
      props: { album: album({ id: 'single', photoCount: 1 }) },
    })

    expect(wrapper.attributes('data-photos')).toBe('/storage/episode/cover.jpg')
    expect(wrapper.attributes('data-pending')).toBe('false')
  })

  it('альбом без фото не ждёт ответа API', async () => {
    registerEndpoint('/api/gallery/video', () => ({ data: { photos: ['/api.jpg'] } }))

    const wrapper = await mountSuspended(GalleryAlbumProbe, {
      props: { album: album({ id: 'video', photoCount: 0, photos: [] }) },
    })

    expect(wrapper.attributes('data-count')).toBe('0')
    expect(wrapper.attributes('data-pending')).toBe('false')
  })

  it('при сбое запроса оставляет обложку и снимает ожидание', async () => {
    registerEndpoint('/api/gallery/broken', () => {
      throw createError({ statusCode: 500, statusMessage: 'Server Error' })
    })

    const wrapper = await mountSuspended(GalleryAlbumProbe, {
      props: { album: album({ id: 'broken', photoCount: 5 }) },
    })

    expect(wrapper.attributes('data-photos')).toBe('/storage/episode/cover.jpg')
    expect(wrapper.attributes('data-pending')).toBe('false')
  })
})
