import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import type { HomePageData } from '#shared/types/home'
import type { HomeResponseDto } from '#shared/types/dto/home'

type CacheOptions = {
  maxAge?: number
  name?: string
  getKey?: () => string
}

type HomeHandler = (event: unknown) => Promise<{ data: HomePageData }>

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
    feed: [
      {
        type: 'action',
        slug: 'linzmaster',
        title: 'Бесплатная диагностика',
        image: '/images/home/news/colins.jpg',
        date: '2026-10-01',
        period: { from: '2026-10-01', to: '2026-10-31' },
        source: { kind: 'tenant', name: 'ЛИНЗМАСТЕР', slug: 'linzmaster' },
        url: '/news/linzmaster',
      },
      {
        type: 'news',
        slug: 'balabala',
        title: 'Зимняя коллекция',
        image: '/images/home/news/ekonika.jpg',
        date: '2026-09-30',
        period: null,
        source: { kind: 'mall', name: 'ТРЦ «Щёлковский»' },
        url: '/news/balabala',
      },
    ],
    brands: [{ name: 'Без схемы' }],
    categories: [],
    gallery: [
      {
        slug: 'test-album',
        title: 'Тестовый альбом',
        date: '2026-05-30',
        cover: '/images/gallery/stars-time-party.jpg',
        photos_count: 10,
        has_video: false,
      },
    ],
    video_url: 'https://rutube.ru/play/embed/test',
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

    expect(body.data.slides).toEqual([
      {
        id: '472',
        title: 'Русалочка',
        imageSrc: '/images/home/intro-1.png',
        imageSrcMobile: '/images/home/intro-1-mobile.jpg',
        imageAlt: 'Русалочка',
      },
    ])
    expect(body.data.feed.map((item) => item.date)).toEqual(['до 31 октября', '30 сентября'])
    expect(body.data.feed[0]).toMatchObject({
      tagLabel: 'Акция',
      tagVariant: 'action',
      category: 'ЛИНЗМАСТЕР',
      to: '/news/linzmaster',
    })
    expect(body.data.feed[1]).toMatchObject({ tagLabel: 'Новость', tagVariant: 'news' })
    expect(body.data.feed[1]).not.toHaveProperty('source')
    expect(body.data.brands).toEqual([])
    expect(body.data.categories).toEqual([])
    expect(body.data.gallery[0]).toMatchObject({
      id: 'test-album',
      date: '30.05.2026',
      photoCount: 10,
      photos: ['/images/gallery/stars-time-party.jpg'],
    })
    expect(body.data.videoUrl).toBe('https://rutube.ru/play/embed/test')
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

  it('502, если feed не массив', async () => {
    const handler = await loadHomeHandler(
      upstreamReturning({
        data: { ...validDto.data, feed: null },
      }),
    )

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
