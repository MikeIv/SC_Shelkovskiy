import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { LayoutProbe } from './support/LayoutProbe'

describe('useSiteLayout — данные из API', () => {
  it('оставляет соцсети стенда и добирает пустую неделю из мока', async () => {
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
          timezone: 'Europe/Moscow',
          week: [],
          exceptions: [],
          tenants: [],
        },
        socials: [
          {
            label: 'Dzen',
            href: 'https://dzen.ru/id/test',
            icon: null,
            iconSrc: '/images/layout/hours-mall.png',
          },
        ],
        apps: [],
        ctaMax: null,
      },
    }))

    const wrapper = await mountSuspended(LayoutProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-social')).toBe('Dzen'))
    expect(wrapper.attributes('data-fallback')).toBe('false')
    expect(wrapper.attributes('data-week')).toBe('7')
    expect(wrapper.attributes('data-phone')).toBe('+7 (499) 677-44-44')
    expect(wrapper.attributes('data-loaded')).toBe('true')
    expect(wrapper.attributes('data-store-social')).toBe('Dzen')
  })
})
