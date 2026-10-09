import { describe, expect, it } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { shopsCatalogItems } from '~/data/shopsCatalogItems'
import { CatalogProbe } from './support/CatalogProbe'

const apiShop = {
  id: '1',
  imageSrc: '/images/home/brands/zolotoy.png',
  imageAlt: 'Из API',
  category: 'Одежда',
  categorySlug: 'odezhda',
  title: 'Из API',
  floor: '1 этаж',
  to: '/shops/iz-api',
  mapUrl: '/map?tenant=iz-api',
  tenantId: 'iz-api',
}

describe('useCatalog', () => {
  it('кладёт список и счётчики фильтров из API в стор', async () => {
    registerEndpoint('/api/tenants', () => ({
      data: {
        items: [apiShop],
        filters: {
          categories: [{ value: 'odezhda', label: 'Одежда', count: 6 }],
          floors: [{ value: '1 этаж', label: '1 этаж', count: 41 }],
        },
        total: 1,
      },
    }))

    const wrapper = await mountSuspended(CatalogProbe, { props: { catalog: 'shops' } })

    expect(wrapper.attributes('data-total')).toBe('1')
    expect(wrapper.attributes('data-first')).toBe('Из API')
    expect(wrapper.attributes('data-odezhda')).toBe('6')
    expect(wrapper.attributes('data-fallback')).toBe('false')
    expect(wrapper.attributes('data-breakfast')).toBe('false')
  })

  it('при ошибке upstream оставляет мок раздела', async () => {
    registerEndpoint('/api/tenants', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(CatalogProbe, { props: { catalog: 'shops' } })

    expect(wrapper.attributes('data-fallback')).toBe('true')
    expect(wrapper.attributes('data-first')).toBe(shopsCatalogItems[0]?.title)
    expect(wrapper.attributes('data-count')).toBe(String(shopsCatalogItems.length))
  })

  it('прячет завтраки, пока в данных кафе их нет', async () => {
    registerEndpoint('/api/tenants', () => ({
      data: {
        items: [{ ...apiShop, id: '2', title: 'Кофе', breakfast: false, tags: [] }],
        filters: { categories: [], floors: [] },
        total: 1,
      },
    }))

    const wrapper = await mountSuspended(CatalogProbe, { props: { catalog: 'cafes' } })

    expect(wrapper.attributes('data-breakfast')).toBe('false')
    expect(wrapper.attributes('data-lunch')).toBe('false')
    expect(wrapper.attributes('data-first')).toBe('Кофе')
  })
})
