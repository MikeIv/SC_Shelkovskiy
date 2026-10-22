import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { AwardsItem } from '#shared/types/awards'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type AwardsHandler = (event: unknown) => Promise<{ data: AwardsItem[] }>

const listDto = {
  data: [
    { slug: 'cre', title: 'CRE', date: '2024-06-26', url: '/awards/cre' },
    { slug: 'no-date', title: 'Без даты', date: null, url: '/awards/no-date' },
  ],
}

let cacheOptions: CacheOptions | undefined
let requestedPath = ''

async function loadHandler(resolve: () => unknown = () => listDto): Promise<AwardsHandler> {
  vi.resetModules()
  cacheOptions = undefined
  requestedPath = ''

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('apiFetch', () => (path: string) => {
    requestedPath = path
    return Promise.resolve(resolve())
  })

  const module = await import('../../server/api/awards/index.get')
  return module.default as AwardsHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/awards/index.get', () => {
  it('запрашивает все награды без пагинации', async () => {
    const handler = await loadHandler()

    const body = await handler({})

    expect(requestedPath).toBe('/awards')
    expect(body.data).toEqual([
      { id: 'cre', title: 'CRE', date: '26.06.2024', dateIso: '2024-06-26' },
      { id: 'no-date', title: 'Без даты', date: '', dateIso: '' },
    ])
  })

  it('кэширует список на 300 секунд', async () => {
    const handler = await loadHandler()

    await handler({})

    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-awards')
    expect(cacheOptions?.getKey?.({})).toBe('awards')
  })

  it('502, если data не массив', async () => {
    const handler = await loadHandler(() => ({ data: {} }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
