import { describe, expect, it } from 'vitest'
import type { HomeResponseDto, HomeSlideDto } from '#shared/types/dto/home'
import { mapHomeIntroSlides } from '#shared/utils/mappers/home'

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
