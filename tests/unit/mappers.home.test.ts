import { describe, expect, it } from 'vitest'
import type { HomeResponseDto, HomeSlideDto } from '#shared/types/dto/home'
import {
  mapHomeBrands,
  mapHomeCategories,
  mapHomeFeed,
  mapHomeGallery,
  mapHomeIntroSlides,
} from '#shared/utils/mappers/home'

function homeDto(slides: unknown[]): HomeResponseDto {
  return {
    data: {
      slides: slides as HomeSlideDto[],
      feed: [],
      brands: [],
      categories: [],
      gallery: [],
      video_url: null,
    },
  }
}

const fullSlide: HomeSlideDto = {
  id: 472,
  title: 'Русалочка. Тайна морских глубин',
  description: '  Интерактивный спектакль  ',
  image: '  /images/home/intro-1.png  ',
  image_mobile: '  /images/home/intro-1-mobile.jpg  ',
  video: 'https://example.invalid/video.mp4',
  url: '/events/rusalochka',
}

describe('mapHomeIntroSlides', () => {
  it('маппит слайд в UI-тип и обрезает пробелы', () => {
    expect(mapHomeIntroSlides(homeDto([fullSlide]))).toEqual([
      {
        id: '472',
        title: 'Русалочка. Тайна морских глубин',
        description: 'Интерактивный спектакль',
        imageSrc: '/images/home/intro-1.png',
        imageSrcMobile: '/images/home/intro-1-mobile.jpg',
        imageAlt: 'Русалочка. Тайна морских глубин',
      },
    ])
  })

  it('не тащит в UI-тип поля video и url (вне scope волны 0)', () => {
    const [slide] = mapHomeIntroSlides(homeDto([fullSlide]))

    expect(slide).not.toHaveProperty('video')
    expect(slide).not.toHaveProperty('url')
  })

  it('null в title и description даёт пустой заголовок и декоративный alt', () => {
    const [slide] = mapHomeIntroSlides(homeDto([{ ...fullSlide, title: null, description: null }]))

    expect(slide).toMatchObject({ title: '', imageAlt: '' })
    expect(slide).not.toHaveProperty('description')
  })

  it('без image_mobile не добавляет портретный кадр', () => {
    const [slide] = mapHomeIntroSlides(homeDto([{ ...fullSlide, image_mobile: null }]))

    expect(slide).not.toHaveProperty('imageSrcMobile')
  })

  it('отбрасывает слайды без картинки или с пустой строкой', () => {
    const slides = mapHomeIntroSlides(
      homeDto([
        { ...fullSlide, image: undefined },
        { ...fullSlide, id: 1, image: '   ' },
        { ...fullSlide, id: 2, image: null },
        fullSlide,
      ]),
    )

    expect(slides.map((slide) => slide.id)).toEqual(['472'])
  })

  it('пустой список слайдов — пустой результат', () => {
    expect(mapHomeIntroSlides(homeDto([]))).toEqual([])
  })

  it('числовой id превращается в строку', () => {
    const [slide] = mapHomeIntroSlides(homeDto([{ ...fullSlide, id: 7 }]))

    expect(slide.id).toBe('7')
    expect(typeof slide.id).toBe('string')
  })
})

describe('mapHomeFeed', () => {
  it('акцию показывает сроком «до …», новость — датой без года', () => {
    const cards = mapHomeFeed([
      {
        type: 'action',
        slug: 'linzmaster',
        title: 'Диагностика',
        image: '/storage/promo.jpg',
        date: '2026-10-01',
        period: { from: '2026-10-01', to: '2026-10-31' },
        source: { kind: 'tenant', name: 'ЛИНЗМАСТЕР', slug: 'linzmaster' },
        url: '/news/linzmaster',
      },
      {
        type: 'news',
        slug: 'balabala',
        title: 'Коллекция',
        image: null,
        date: '2026-09-30',
        period: null,
        source: { kind: 'mall', name: 'ТРЦ «Щёлковский»' },
        url: '/news/balabala',
      },
    ])

    expect(cards[0]).toMatchObject({
      id: 'linzmaster',
      date: 'до 31 октября',
      category: 'ЛИНЗМАСТЕР',
      tagLabel: 'Акция',
      tagVariant: 'action',
      imageAlt: 'Диагностика',
      to: '/news/linzmaster',
    })
    expect(cards[1]).toMatchObject({
      date: '30 сентября',
      imageSrc: '',
      tagLabel: 'Новость',
      category: 'ТРЦ «Щёлковский»',
    })
  })

  it('неизвестный type помечает как other и не роняет карточку', () => {
    const [card] = mapHomeFeed([
      {
        type: 'podcast',
        slug: 'pod',
        title: 'Выпуск',
        image: '/a.jpg',
        date: '2026-01-02',
        period: null,
        source: null,
        url: '',
      },
    ])

    expect(card).toMatchObject({ tagVariant: 'other', tagLabel: 'podcast', date: '2 января' })
    expect(card).not.toHaveProperty('to')
  })

  it('внешний url не становится ссылкой карточки', () => {
    const [card] = mapHomeFeed([
      {
        type: 'news',
        slug: 'external',
        title: 'Снаружи',
        image: '/a.jpg',
        date: '2026-07-14',
        period: null,
        source: null,
        url: 'https://example.invalid/news',
      },
    ])

    expect(card).not.toHaveProperty('to')
  })

  it('пропускает элемент без slug', () => {
    expect(mapHomeFeed([{ type: 'news', slug: '  ', title: 'Без адреса' }])).toEqual([])
  })
})

describe('mapHomeGallery', () => {
  it('форматирует дату и кладёт обложку в lightbox, если есть фото', () => {
    const [album] = mapHomeGallery([
      {
        slug: 'party',
        title: 'Вечеринка',
        date: '2026-05-30',
        cover: '  /storage/cover.jpg  ',
        photos_count: 13,
        has_video: false,
      },
    ])

    expect(album).toEqual({
      id: 'party',
      title: 'Вечеринка',
      date: '30.05.2026',
      imageSrc: '/storage/cover.jpg',
      imageAlt: 'Вечеринка',
      photoCount: 13,
      photos: ['/storage/cover.jpg'],
    })
    expect(album).not.toHaveProperty('has_video')
  })

  it('альбом без фото не открывает lightbox', () => {
    const [album] = mapHomeGallery([
      {
        slug: 'video',
        title: 'Ролик',
        date: '2026-03-08',
        cover: '/storage/cover.jpg',
        photos_count: 0,
        has_video: true,
      },
    ])

    expect(album?.photoCount).toBe(0)
    expect(album).not.toHaveProperty('photos')
    expect(album?.hasVideo).toBe(true)
  })

  it('пропускает альбом без обложки', () => {
    expect(mapHomeGallery([{ slug: 'empty', title: 'Пусто', cover: '  ' }])).toEqual([])
  })
})

describe('mapHomeBrands', () => {
  it('не собирает вёрстку из нераспознанных элементов', () => {
    const unknown = [{ name: 'EKONIKA', logo: '/storage/logo.png' }]

    expect(mapHomeBrands(unknown)).toEqual([])
    expect(mapHomeBrands([])).toEqual([])
  })
})

describe('mapHomeCategories', () => {
  const category = {
    slug: 'zhenskaya-odezhda',
    title: 'Женская одежда',
    image_left: 'https://stand.invalid/storage/categories/women-left.jpg',
    image_right: 'https://stand.invalid/storage/categories/women-right.jpg',
    url: '/shops?category=zhenskaya-odezhda',
  }

  it('маппит плитку в UI-тип: пара картинок и alt из title', () => {
    expect(mapHomeCategories([category])).toEqual([
      {
        id: 'zhenskaya-odezhda',
        title: 'Женская одежда',
        leftImageSrc: 'https://stand.invalid/storage/categories/women-left.jpg',
        leftImageAlt: 'Женская одежда',
        rightImageSrc: 'https://stand.invalid/storage/categories/women-right.jpg',
        rightImageAlt: 'Женская одежда',
      },
    ])
  })

  it('обрезает пробелы и не тащит url в UI-тип', () => {
    const [tile] = mapHomeCategories([
      { ...category, title: '  Женская одежда  ', image_left: '  https://stand.invalid/a.jpg  ' },
    ])

    expect(tile).toMatchObject({
      title: 'Женская одежда',
      leftImageSrc: 'https://stand.invalid/a.jpg',
    })
    expect(tile).not.toHaveProperty('url')
  })

  it('пропускает плитку без slug или без одной из картинок', () => {
    const tiles = mapHomeCategories([
      { ...category, slug: '   ' },
      { ...category, slug: 'no-right', image_right: null },
      { ...category, slug: 'no-left', image_left: '   ' },
      category,
    ])

    expect(tiles.map((tile) => tile.id)).toEqual(['zhenskaya-odezhda'])
  })

  it('без title плитка остаётся, alt декоративный', () => {
    const [tile] = mapHomeCategories([{ ...category, title: null }])

    expect(tile).toMatchObject({ title: '', leftImageAlt: '', rightImageAlt: '' })
  })

  it('пустой список — пустой результат', () => {
    expect(mapHomeCategories([])).toEqual([])
  })
})
