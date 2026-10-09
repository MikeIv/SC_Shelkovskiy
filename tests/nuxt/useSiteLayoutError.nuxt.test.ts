import { describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { LayoutProbe } from './support/LayoutProbe'

describe('useSiteLayout — сбой API', () => {
  it('отдаёт мок целиком, если прокси ответил ошибкой', async () => {
    registerEndpoint('/api/layout', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(LayoutProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-fallback')).toBe('true'))
    expect(wrapper.attributes('data-social')).toBe('Сайт')
    expect(wrapper.attributes('data-week')).toBe('7')
    expect(wrapper.attributes('data-store-social')).toBe('Сайт')
  })
})
