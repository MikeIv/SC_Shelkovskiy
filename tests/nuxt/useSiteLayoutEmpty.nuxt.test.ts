import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { LayoutProbe } from './support/LayoutProbe'

describe('useSiteLayout — пустые соцсети', () => {
  it('оставляет мок соцсетей, но не помечает запрос фолбэком', async () => {
    registerEndpoint('/api/layout', () => ({
      data: {
        contacts: {
          address: '',
          metro: '',
          phone: '',
          phoneHref: '',
          email: '',
          emailHref: '',
          departments: [],
        },
        hours: {
          timezone: '',
          week: [],
          exceptions: [],
          tenants: [],
        },
        socials: [],
        apps: [],
        ctaMax: null,
      },
    }))

    const wrapper = await mountSuspended(LayoutProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-social')).toBe('Сайт'))
    expect(wrapper.attributes('data-fallback')).toBe('false')
    expect(wrapper.attributes('data-week')).toBe('7')
  })
})
