import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { LayoutData } from '#shared/types/layout'
import type { LayoutResponseDto } from '#shared/types/dto/layout'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: () => string
}

type LayoutHandler = (event: unknown) => Promise<{ data: LayoutData }>

const validDto: LayoutResponseDto = {
  data: {
    contacts: {
      address: 'Москва, Щёлковское шоссе, 75',
      metro: null,
      phone: null,
      email: null,
      departments: [],
    },
    hours: {
      timezone: 'Europe/Moscow',
      week: [],
      exceptions: [],
      tenants: [],
    },
    socials: [{ name: 'Dzen', url: 'https://dzen.ru/id/1', icon: 'https://cdn.example/dzen.svg' }],
    apps: { app_store: null, google_play: null, rustore: null },
    cta_max: { url: null, title: null, description: null, image: null },
  },
}

let cacheOptions: CacheOptions | undefined

async function loadLayoutHandler(apiFetchImpl: () => unknown): Promise<LayoutHandler> {
  vi.resetModules()
  cacheOptions = undefined

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('apiFetch', apiFetchImpl)

  const module = await import('../../server/api/layout.get')
  return module.default as LayoutHandler
}

function upstreamReturning(payload: unknown) {
  return () => () => Promise.resolve(payload)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/layout.get', () => {
  it('маппит layout и отдаёт конверт с UI-типом', async () => {
    const handler = await loadLayoutHandler(upstreamReturning(validDto))

    const body = await handler({})

    expect(body.data.contacts.address).toBe('Москва, Щёлковское шоссе, 75')
    expect(body.data.socials[0]?.label).toBe('Dzen')
    expect(body.data.ctaMax).toBeNull()
    expect(JSON.stringify(body)).not.toContain('Basic')
  })

  it('кэширует ответ на 300 секунд по постоянному ключу', async () => {
    const handler = await loadLayoutHandler(upstreamReturning(validDto))

    await handler({})

    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-layout')
    expect(cacheOptions?.getKey?.()).toBe('layout')
  })

  it('502, если в ответе нет обязательных объектов', async () => {
    const handler = await loadLayoutHandler(upstreamReturning({ data: { socials: [] } }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })

  it('пробрасывает h3-ошибку upstream как есть (503 без настроенного upstream)', async () => {
    const handler = await loadLayoutHandler(() => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    await expect(handler({})).rejects.toMatchObject({ statusCode: 503 })
  })

  it('сохраняет статус ошибки upstream (429), а не подменяет его на 502', async () => {
    const handler = await loadLayoutHandler(() => () => Promise.reject({ statusCode: 429 }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 429 })
  })

  it('502 на неизвестную ошибку без статуса', async () => {
    const handler = await loadLayoutHandler(() => () => Promise.reject(new Error('socket hang up')))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
