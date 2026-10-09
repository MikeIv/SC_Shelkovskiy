import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import type { CatalogListData } from '#shared/types/catalog'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type TenantsHandler = (event: unknown) => Promise<{ data: CatalogListData }>

const listDto = {
  data: [
    {
      id: 1,
      slug: 'test-shop',
      name: 'Тестовый магазин',
      type: 'shops',
      category: { slug: 'odezhda', name: 'Одежда' },
      floor: { id: 1, label: '1', name: '1 этаж' },
      podium: '101',
      logo: '/images/home/brands/zolotoy.png',
      image: null,
      status: 'none',
      tags: ['action'],
      breakfast: false,
      business_lunch: false,
      url: '/shops/test-shop',
    },
  ],
  meta: {
    filters: {
      categories: [{ slug: 'odezhda', name: 'Одежда', count: 6 }],
      floors: [{ id: 1, name: '1 этаж', count: 41 }],
    },
  },
}

let cacheOptions: CacheOptions | undefined
let requestedPath = ''

async function loadHandler(apiFetchImpl: (path: string) => unknown): Promise<TenantsHandler> {
  vi.resetModules()
  cacheOptions = undefined
  requestedPath = ''

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('getQuery', () => ({ type: 'shops' }))
  vi.stubGlobal('apiFetch', () => (path: string) => {
    requestedPath = path
    return Promise.resolve(apiFetchImpl(path))
  })

  const module = await import('../../server/api/tenants/index.get')
  return module.default as TenantsHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/tenants/index.get', () => {
  it('одним запросом маппит список и фильтры', async () => {
    const handler = await loadHandler(() => listDto)

    const body = await handler({})

    expect(requestedPath).toBe('/tenants?type=shops')
    expect(body.data.total).toBe(1)
    expect(body.data.items[0]).toMatchObject({
      id: '1',
      title: 'Тестовый магазин',
      categorySlug: 'odezhda',
      tags: ['action'],
    })
    expect(body.data.filters.categories).toEqual([{ value: 'odezhda', label: 'Одежда', count: 6 }])
    expect(body.data.filters.floors).toEqual([{ value: '1 этаж', label: '1 этаж', count: 41 }])
  })

  it('кэширует раздел на 300 секунд по типу', async () => {
    const handler = await loadHandler(() => listDto)

    await handler({})

    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-tenants')
    expect(cacheOptions?.getKey?.({})).toBe('tenants:shops')
  })

  it('400 на неизвестный type и не ходит в upstream', async () => {
    const handler = await loadHandler(() => listDto)
    vi.stubGlobal('getQuery', () => ({ type: 'mall' }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 400 })
    expect(requestedPath).toBe('')
  })

  it('502, если data не массив', async () => {
    const handler = await loadHandler(() => ({ data: {} }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
