import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'
import type { CinemaListData } from '#shared/types/cinema'

/**
 * Ручка «Кино»: единственная в `server/api`, которая ходит не в Laravel, а в Афишу.
 * Здесь проверяем обвязку — конверт, кэш и перевод ошибок; справочники и расписание —
 * в `tests/unit/afishaApi.test.ts`, разбор ответа — в `tests/unit/mappers.afisha.test.ts`.
 *
 * Клиент Афиши подменяем модулем: он тянет `$fetch` и `useRuntimeConfig` из рантайма Nitro,
 * которого в тестовом окружении нет.
 */

const afisha = vi.hoisted(() => ({
  result: null as CinemaListData | null,
  error: null as unknown,
}))

vi.mock('../../server/utils/afishaApi', () => ({
  fetchAfishaCinemaFromEvent: async () => {
    if (afisha.error) throw afisha.error

    return afisha.result
  },
}))

type CacheOptions = { maxAge?: number; name?: string; getKey?: () => string }
type Handler = (event: unknown) => Promise<unknown>

const CINEMA: CinemaListData = {
  cityId: '2',
  placeId: '4242',
  items: [
    {
      id: '989798',
      title: 'Кодекс Данте',
      genres: 'Детектив',
      posterSrc: 'https://cdn.afisha.ru/poster.jpg',
      posterAlt: 'Постер фильма «Кодекс Данте»',
      ageRating: '18+',
      creationId: '989798',
      onSale: true,
      ticketUrl: 'https://www.afisha.ru/movie/kodeks-dante/',
    },
  ],
}

const state: { cache?: CacheOptions } = { cache: undefined }

beforeEach(() => {
  state.cache = undefined
  afisha.result = CINEMA
  afisha.error = null

  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    state.cache = options

    return handler
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function loadRoute(): Promise<Handler> {
  const module = await import('../../server/api/cinema.get')

  return module.default as unknown as Handler
}

describe('GET /api/cinema', () => {
  it('отдаёт расписание кинотеатра конвертом и кэширует на 30 минут', async () => {
    const handler = await loadRoute()

    await expect(handler({})).resolves.toEqual({ data: CINEMA })
    expect(state.cache).toMatchObject({ maxAge: 1800, name: 'api-cinema' })
    expect(state.cache?.getKey?.()).toBe('cinema')
  })

  it('ошибка Афиши уходит наружу кодом, чтобы клиент подставил моки', async () => {
    afisha.error = createError({ statusCode: 502, statusMessage: 'Afisha place is not found' })

    const handler = await loadRoute()

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })

  it('ошибка вне контракта становится 502', async () => {
    afisha.error = new Error('network')

    const handler = await loadRoute()

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
