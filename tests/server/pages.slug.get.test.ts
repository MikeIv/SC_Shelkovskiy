import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { PageData } from '#shared/types/page'
import type { PageResponseDto } from '#shared/types/dto/pages'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type PageHandler = (event: unknown) => Promise<{ data: PageData }>

const validDto: PageResponseDto = {
  data: {
    slug: 'contacts',
    title: 'Контакты',
    blocks: [
      {
        id: 'form-0',
        type: 'form',
        data: { kind: 'feedback', title: 'Вопрос', description: 'Текст' },
      },
    ],
    seo: {
      title: 'Контакты SEO',
      description: null,
      keywords: null,
      og_image: null,
    },
  },
}

let cacheOptions: CacheOptions | undefined

async function loadPageHandler(apiFetchImpl: () => unknown): Promise<PageHandler> {
  vi.resetModules()
  cacheOptions = undefined

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('getRouterParam', () => 'contacts')
  vi.stubGlobal('apiFetch', apiFetchImpl)

  const module = await import('../../server/api/pages/[slug].get')
  return module.default as PageHandler
}

function upstreamReturning(payload: unknown) {
  return () => () => Promise.resolve(payload)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/pages/[slug].get', () => {
  it('маппит страницу и отдаёт конверт с UI-типом', async () => {
    const handler = await loadPageHandler(upstreamReturning(validDto))

    const body = await handler({})

    expect(body.data.title).toBe('Контакты')
    expect(body.data.seo?.title).toBe('Контакты SEO')
    expect(body.data.form).toEqual({
      kind: 'feedback',
      title: 'Вопрос',
      description: 'Текст',
    })
    expect(JSON.stringify(body)).not.toContain('Basic')
  })

  it('кэширует ответ на 300 секунд по slug', async () => {
    const handler = await loadPageHandler(upstreamReturning(validDto))

    await handler({})

    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-page')
    expect(cacheOptions?.getKey?.({})).toBe('page:contacts')
  })
})
