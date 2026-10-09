import { describe, expect, it } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { TenantProbe } from './support/CatalogProbe'

describe('useTenant', () => {
  it('берёт карточку и новости из API', async () => {
    registerEndpoint('/api/tenants/test-shop', () => ({
      data: {
        slug: 'test-shop',
        catalog: 'shops',
        title: 'Из API',
        category: 'Одежда',
        floor: '1 этаж',
        logoSrc: '',
        logoAlt: 'Из API',
        mapUrl: '/map?tenant=test-shop',
        status: 'none',
        podium: '',
        assortment: null,
        workingHours: [],
        seo: null,
        about: '<p>Описание</p>',
        news: [
          {
            id: 'sale',
            imageSrc: '',
            imageAlt: '',
            date: 'до 31 октября',
            category: 'Из API',
            title: 'Акция',
            tagLabel: 'Акция',
          },
        ],
      },
    }))

    const wrapper = await mountSuspended(TenantProbe, {
      props: { catalog: 'shops', slug: 'test-shop' },
    })

    expect(wrapper.attributes('data-title')).toBe('Из API')
    expect(wrapper.attributes('data-catalog')).toBe('shops')
    expect(wrapper.attributes('data-news')).toBe('1')
    expect(wrapper.attributes('data-about')).toBe('<p>Описание</p>')
  })

  it('404 не подменяет моком', async () => {
    registerEndpoint('/api/tenants/zolotoy', () => {
      throw createError({ statusCode: 404, statusMessage: 'Not found' })
    })

    const wrapper = await mountSuspended(TenantProbe, {
      props: { catalog: 'shops', slug: 'zolotoy' },
    })

    expect(wrapper.attributes('data-title')).toBe('')
  })

  it('без upstream открывает мок по slug', async () => {
    registerEndpoint('/api/tenants/zolotoy', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(TenantProbe, {
      props: { catalog: 'shops', slug: 'zolotoy' },
    })

    expect(wrapper.attributes('data-title')).toBe('585*Золотой')
    expect(wrapper.attributes('data-about')).toContain('<p>')
  })
})
