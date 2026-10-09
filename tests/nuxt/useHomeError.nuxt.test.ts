import { describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { homeIntroSlides } from '~/data/homeIntroSlides'
import { HomeProbe } from './support/HomeProbe'

describe('useHome — сбой API', () => {
  it('отдаёт мок, если прокси ответил ошибкой', async () => {
    registerEndpoint('/api/home', () => {
      throw createError({ statusCode: 502, statusMessage: 'Home API payload is invalid' })
    })

    const wrapper = await mountSuspended(HomeProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-fallback')).toBe('true'))
    expect(wrapper.attributes('data-slides')).toBe(String(homeIntroSlides.length))
  })
})
