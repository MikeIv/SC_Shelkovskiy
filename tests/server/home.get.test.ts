import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import type { HomeIntroSlide } from '#shared/types/home'
import type { HomeResponseDto } from '#shared/types/dto/home'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: () => string
}

type HomeHandler = (event: unknown) => Promise<{ data: { slides: HomeIntroSlide[] } }>

const validDto: HomeResponseDto = {
  data: {
    slides: [
      {
        id: 472,
        title: 'Русалочка',
        description: null,
        image: '/images/home/intro-1.png',
        image_mobile: '/images/home/intro-1-mobile.jpg',
        video: null,
        url: '/events/rusalochka',
      },
      {
        id: 473,
        title: null,
        description: null,
        image: '',
        image_mobile: null,
        video: null,
        url: null,
      },
    ],
    feed: [],
    brands: [],
    categories: [],
    gallery: [],
    video_url: null,
  },
}

let cacheOptions: CacheOptions | undefined

/**
 * Nitro-глобали (`defineCachedEventHandler`, `apiFetch`, `createError`) в тесте мокаются,
 * поэтому обработчик загружается динамически после подстановки — и заново на каждый кейс.
 */
async function loadHomeHandler(apiFetchImpl: () => unknown): Promise<HomeHandler> {
  vi.resetModules()
  cacheOptions = undefined

  vi.stubGlobal('defineCachedEventHandler', (handler: unknown, options?: CacheOptions) => {
    cacheOptions = options
    return handler
  })
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('apiFetch', apiFetchImpl)

  const module = await import('../../server/api/home.get')
  return module.default as HomeHandler
}

/** `apiFetch(event)` возвращает функцию запроса — как настоящий `$fetch.create`. */
function upstreamReturning(payload: unknown) {
  return () => () => Promise.resolve(payload)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/home.get', () => {
  it('маппит слайды и отдаёт конверт с UI-типом', async () => {
    const handler = await loadHomeHandler(upstreamReturning(validDto))

    const body = await handler({})

    expect(body).toEqual({
      data: {
        slides: [
          {
            id: '472',
            title: 'Русалочка',
            imageSrc: '/images/home/intro-1.png',
            imageSrcMobile: '/images/home/intro-1-mobile.jpg',
            imageAlt: 'Русалочка',
          },
        ],
      },
    })
  })

  it('кэширует ответ на 300 секунд по постоянному ключу', async () => {
    const handler = await loadHomeHandler(upstreamReturning(validDto))

    await handler({})

    expect(cacheOptions?.maxAge).toBe(300)
    expect(cacheOptions?.name).toBe('api-home')
    expect(cacheOptions?.getKey?.()).toBe('home')
  })

  it('502, если upstream вернул невалидный payload', async () => {
    const handler = await loadHomeHandler(upstreamReturning({ data: { slides: 'oops' } }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })

  it('502, если в ответе нет data.slides', async () => {
    const handler = await loadHomeHandler(upstreamReturning({ data: {} }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })

  it('пробрасывает h3-ошибку upstream как есть (503 без настроенного upstream)', async () => {
    const handler = await loadHomeHandler(() => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    await expect(handler({})).rejects.toMatchObject({ statusCode: 503 })
  })

  it('сохраняет статус ошибки upstream (429), а не подменяет его на 502', async () => {
    const handler = await loadHomeHandler(() => () => Promise.reject({ statusCode: 429 }))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 429 })
  })

  it('502 на неизвестную ошибку без статуса', async () => {
    const handler = await loadHomeHandler(() => () => Promise.reject(new Error('socket hang up')))

    await expect(handler({})).rejects.toMatchObject({ statusCode: 502 })
  })
})
