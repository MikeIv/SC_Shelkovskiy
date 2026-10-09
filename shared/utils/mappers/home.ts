import type { HomeIntroSlide } from '#shared/types/home'
import type { HomeResponseDto, HomeSlideDto } from '#shared/types/dto/home'
import { resolveAlt } from '#shared/utils/resolveAlt'

export function mapHomeIntroSlides(dto: HomeResponseDto): HomeIntroSlide[] {
  return dto.data.slides.flatMap((slide) => {
    const mapped = mapHomeIntroSlide(slide)
    return mapped ? [mapped] : []
  })
}

function mapHomeIntroSlide(slide: HomeSlideDto): HomeIntroSlide | undefined {
  if (typeof slide.image !== 'string') return undefined

  const imageSrc = slide.image.trim()
  if (!imageSrc) return undefined

  const title = typeof slide.title === 'string' ? slide.title : ''
  const description = typeof slide.description === 'string' ? slide.description.trim() : ''
  const imageSrcMobile = typeof slide.image_mobile === 'string' ? slide.image_mobile.trim() : ''

  return {
    id: String(slide.id),
    title,
    ...(description ? { description } : {}),
    imageSrc,
    ...(imageSrcMobile ? { imageSrcMobile } : {}),
    imageAlt: resolveAlt(title),
  }
}
