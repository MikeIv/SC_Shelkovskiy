import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { HomeProbe } from './support/HomeProbe'

describe('useHome — данные из API', () => {
  it('отдаёт слайды из API и не включает фолбэк', async () => {
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
      },
    }))

    const wrapper = await mountSuspended(HomeProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-first-id')).toBe('901'))
    expect(wrapper.attributes('data-slides')).toBe('1')
    expect(wrapper.attributes('data-fallback')).toBe('false')
  })
})
