import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { homeBrandRows } from '~/data/homeBrandItems'
import { homeGalleryItems } from '~/data/homeGalleryItems'
import { HomeProbe } from './support/HomeProbe'

describe('useHome — данные из API', () => {
  it('берёт слайды и ленту из API, пустые разделы закрывает моком', async () => {
    registerEndpoint('/api/home', () => ({
      data: {
        slides: [
          {
            id: '901',
            title: 'Из API',
            imageSrc: '/images/home/intro-1.png',
            imageAlt: 'Из API',
          },
        ],
        feed: [
          {
            id: 'linzmaster',
            imageSrc: '/images/home/news/colins.jpg',
            imageAlt: 'Акция',
            date: 'до 31 октября',
            category: 'ЛИНЗМАСТЕР',
            title: 'Акция',
            tagLabel: 'Акция',
            tagVariant: 'action',
          },
        ],
        brands: [],
        categories: [],
        gallery: [],
        videoUrl: null,
      },
    }))

    const wrapper = await mountSuspended(HomeProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-first-id')).toBe('901'))
    expect(wrapper.attributes('data-slides')).toBe('1')
    expect(wrapper.attributes('data-feed')).toBe('1')
    expect(wrapper.attributes('data-feed-date')).toBe('до 31 октября')
    expect(wrapper.attributes('data-brands')).toBe(String(homeBrandRows.length))
    expect(wrapper.attributes('data-gallery')).toBe(String(homeGalleryItems.length))
    expect(wrapper.attributes('data-fallback')).toBe('false')
    expect(wrapper.attributes('data-demo-slides')).toBe('false')
    expect(wrapper.attributes('data-demo-feed')).toBe('false')
    expect(wrapper.attributes('data-demo-brands')).toBe('true')
    expect(wrapper.attributes('data-demo-gallery')).toBe('true')
  })
})
