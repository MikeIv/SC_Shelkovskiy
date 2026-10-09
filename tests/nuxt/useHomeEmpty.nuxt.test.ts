import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { homeIntroSlides } from '~/data/homeIntroSlides'
import { HomeProbe } from './support/HomeProbe'

describe('useHome — пустой ответ API', () => {
  it('подставляет мок и помечает фолбэк', async () => {
    registerEndpoint('/api/home', () => ({ data: { slides: [] } }))

    const wrapper = await mountSuspended(HomeProbe)

    await vi.waitFor(() =>
      expect(wrapper.attributes('data-slides')).toBe(String(homeIntroSlides.length)),
    )
    expect(wrapper.attributes('data-fallback')).toBe('true')
  })
})
