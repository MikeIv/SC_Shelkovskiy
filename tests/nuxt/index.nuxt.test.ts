import { describe, expect, it, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { siteName } from '~/data/siteMeta'
import IndexPage from '~/pages/index.vue'

describe('pages/index', () => {
  it('держит единственный h1 страницы, а заголовок слайда отдаёт как h2', async () => {
    registerEndpoint('/api/home', () => ({
      data: {
        slides: [
          {
            id: '901',
            title: 'Слайд из API',
            imageSrc: '/images/home/intro-1.png',
            imageAlt: 'Слайд из API',
          },
        ],
      },
    }))

    const wrapper = await mountSuspended(IndexPage)

    await vi.waitFor(() =>
      expect(wrapper.findAll('h2').map((heading) => heading.text())).toContain('Слайд из API'),
    )

    const h1 = wrapper.findAll('h1')
    expect(h1).toHaveLength(1)
    expect(h1[0]!.text()).toBe(siteName)
  })
})
