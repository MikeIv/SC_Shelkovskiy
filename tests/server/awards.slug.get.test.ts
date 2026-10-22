import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { ApiQuery } from '#shared/api/endpoints'
import type { AwardsDetailData } from '#shared/types/awards'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type AwardHandler = (event: unknown) => Promise<{ data: AwardsDetailData }>

const detailDto = {
  data: {
    slug: 'cre',
    title: 'CRE',
    date: '2021-04-04',
    url: '/awards/cre',
    subtitle: null,
    image: 'https://cdn.example/a.jpg',
    text: '<p>Текст</p>',
    seo: { title: 'SEO', description: null, keywords: null, og_image: null },
  },
}

const relatedDto = {
  data: [{ slug: 'other', title: 'Другая', date: '2022-01-01', url: '/awards/other' }],
}

let cacheOptions: CacheOptions | undefined
const calls: { path: string; query?: ApiQuery }[] = []

async function loadHandler(
  resolve: (path: string) => unknown | Promise<unknown>,
): Promise<AwardHandler> {
  vi.resetModules()
  cacheOptions = undefined
  calls.length = 0

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('getRouterParam', () => 'cre')
  vi.stubGlobal('apiFetch', () => (path: string, options?: { query?: ApiQuery }) => {
    calls.push({ path, query: options?.query })
    return Promise.resolve(resolve(path))
  })

  const module = await import('../../server/api/awards/[slug].get')
  return module.default as AwardHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/awards/[slug].get', () => {
  it('маппит карточку и остальные награды', async () => {
    const handler = await loadHandler((path) => (path === '/awards' ? relatedDto : detailDto))

    const body = await handler({})

    expect(calls[0]?.path).toBe('/awards/cre')
    expect(calls[1]).toEqual({ path: '/awards', query: { exclude: 'cre' } })
    expect(body.data.item).toMatchObject({
      id: 'cre',
      date: '04.04.2021',
      bodyHtml: '<p>Текст</p>',
      imageSrc: 'https://cdn.example/a.jpg',
      seo: { title: 'SEO' },
    })
    expect(body.data.related[0]).toMatchObject({ id: 'other', date: '01.01.2022' })
    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-award')
    expect(cacheOptions?.getKey?.({})).toBe('award:cre')
  })

  it('пробрасывает 404 upstream', async () => {
    const handler = await loadHandler(() => Promise.reject({ statusCode: 404 }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 })
  })

  it('502, если в ответе нет объекта data', async () => {
    const handler = await loadHandler(() => ({ data: 'oops' }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
