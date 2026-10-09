import { describe, expect, it, vi } from 'vitest'
import { getActivePinia, setActivePinia } from 'pinia'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { LayoutProbe } from './support/LayoutProbe'

/**
 * `@pinia/nuxt` снимает активную Pinia в `app:rendered` любого запроса, поэтому при
 * параллельном SSR `useLayoutStore()` после `await` остаётся без контекста и роняет рендер.
 * Эндпоинт снимает Pinia, пока `useSiteLayout` ждёт ответ: гонка воспроизводится детерминированно.
 */
describe('useSiteLayout — гонка параллельных SSR-запросов', () => {
  it('резолвит стор до await и не зависит от глобальной activePinia', async () => {
    registerEndpoint('/api/layout', () => {
      setActivePinia(undefined)

      return {
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
          hours: { timezone: 'Europe/Moscow', week: [], exceptions: [], tenants: [] },
          socials: [
            {
              label: 'Dzen',
              href: 'https://dzen.ru/id/race',
              icon: null,
              iconSrc: '/images/layout/hours-mall.png',
            },
          ],
          apps: [],
          ctaMax: null,
        },
      }
    })

    const piniaBefore = getActivePinia()

    try {
      const wrapper = await mountSuspended(LayoutProbe)

      await vi.waitFor(() => expect(wrapper.attributes('data-store-social')).toBe('Dzen'))
      expect(wrapper.attributes('data-fallback')).toBe('false')
      expect(wrapper.attributes('data-loaded')).toBe('true')
    } finally {
      setActivePinia(piniaBefore)
    }
  })
})
