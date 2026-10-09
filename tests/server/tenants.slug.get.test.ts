import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { TenantDetail } from '#shared/types/tenantDetail'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type TenantHandler = (event: unknown) => Promise<{ data: TenantDetail }>

const tenantDto = {
  data: {
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
    tags: [],
    breakfast: false,
    business_lunch: false,
    url: '/shops/test-shop',
    gallery: ['/images/tenant/befree/gallery-1.jpg'],
    phone: '+7 (495) 730-10-86',
    website: null,
    about: '<p>Описание тестового магазина</p>',
    assortment: null,
    working_hours: [],
    map_url: '/map?tenant=test-shop',
    seo: { title: 'Тестовый магазин', description: 'Описание', keywords: null, og_image: null },
  },
}

const feedDto = {
  data: [
    {
      type: 'action',
      slug: 'test-tenant-action',
      title: 'Тестовая акция арендатора',
      image: '/images/home/news/colins.jpg',
      date: '2026-10-01',
      period: { from: '2026-10-01', to: '2026-10-31' },
      source: { kind: 'tenant', name: 'Тестовый магазин', slug: 'test-shop' },
      url: '/news/test-tenant-action',
    },
  ],
}

let cacheOptions: CacheOptions | undefined
const requested: string[] = []

async function loadHandler(
  resolve: (path: string) => unknown | Promise<unknown>,
): Promise<TenantHandler> {
  vi.resetModules()
  cacheOptions = undefined
  requested.length = 0

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('getRouterParam', () => 'test-shop')
  vi.stubGlobal('apiFetch', () => (path: string) => {
    requested.push(path)
    return Promise.resolve(resolve(path))
  })

  const module = await import('../../server/api/tenants/[slug].get')
  return module.default as TenantHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/tenants/[slug].get', () => {
  it('маппит карточку и подмешивает ленту арендатора', async () => {
    const handler = await loadHandler((path) => (path === '/feed' ? feedDto : tenantDto))

    const body = await handler({})

    expect(requested).toEqual(['/tenants/test-shop', '/feed'])
    expect(body.data).toMatchObject({
      slug: 'test-shop',
      catalog: 'shops',
      title: 'Тестовый магазин',
      about: '<p>Описание тестового магазина</p>',
    })
    expect(body.data.news[0]).toMatchObject({
      title: 'Тестовая акция арендатора',
      date: 'до 31 октября',
      tagLabel: 'Акция',
    })
    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.getKey?.({})).toBe('tenant:test-shop')
  })

  it('отдаёт карточку с пустой лентой, если /feed упал', async () => {
    const handler = await loadHandler((path) => {
      if (path === '/feed') return Promise.reject(new Error('feed down'))
      return tenantDto
    })

    const body = await handler({})

    expect(body.data.news).toEqual([])
    expect(body.data.title).toBe('Тестовый магазин')
  })

  it('502, если в ответе нет объекта data', async () => {
    const handler = await loadHandler(() => ({ data: [] }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })

  it('пробрасывает 404 upstream', async () => {
    const handler = await loadHandler(() => Promise.reject({ statusCode: 404 }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 })
  })
})
