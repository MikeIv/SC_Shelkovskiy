import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { VacanciesResponseDto } from '#shared/types/dto/vacancies'
import type { VacancyItem } from '#shared/types/vacancies'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: (event?: unknown) => string
}

type VacanciesHandler = (event: unknown) => Promise<{ data: VacancyItem[] }>

const listDto: VacanciesResponseDto = {
  data: [
    {
      slug: 'svarschik',
      title: 'Сварщик',
      contacts: { name: null, phone: '+7 (499) 677-88-88', email: 'es.naumets@schelkovsky-trc.ru' },
      sections: [
        { title: 'Обязанности:', items: ['Сварка трубопроводов'] },
        { title: 'Условия:', items: ['График работы 2/2'] },
      ],
    },
    {
      slug: 'street-beat',
      title: 'Продавец-консультант Street Beat',
      contacts: { name: null, phone: null, email: null },
      sections: [],
    },
  ],
}

let cacheOptions: CacheOptions | undefined
let requestedPath = ''

async function loadHandler(apiFetchImpl: () => unknown): Promise<VacanciesHandler> {
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
    return Promise.resolve(apiFetchImpl())
  })

  const module = await import('../../server/api/vacancies.get')
  return module.default as VacanciesHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/vacancies.get', () => {
  it('маппит список и отдаёт конверт с UI-типом', async () => {
    const handler = await loadHandler(() => listDto)

    const body = await handler({})

    expect(requestedPath).toBe('/vacancies')
    expect(body.data).toHaveLength(2)
    expect(body.data[0]).toMatchObject({
      id: 'svarschik',
      title: 'Сварщик',
      contacts: {
        phoneHref: 'tel:+74996778888',
        emailHref: 'mailto:es.naumets@schelkovsky-trc.ru',
      },
    })
    expect(body.data[1]).not.toHaveProperty('contacts')
    expect(JSON.stringify(body)).not.toContain('Basic')
  })

  it('кэширует ответ на 300 секунд без параметров', async () => {
    const handler = await loadHandler(() => listDto)

    await handler({})

    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-vacancies')
    expect(cacheOptions?.getKey?.({})).toBe('vacancies')
  })

  it('502, если data не массив', async () => {
    const handler = await loadHandler(() => ({ data: {} }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
