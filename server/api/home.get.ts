import type { HomeResponseDto } from '#shared/types/dto/home'
import type { HomeIntroSlide } from '#shared/types/home'
import { mapHomeIntroSlides } from '#shared/utils/mappers/home'
import { defineApiProxy } from '../utils/apiProxy'

const HOME_CACHE_SECONDS = 300

export default defineApiProxy<HomeResponseDto, { slides: HomeIntroSlide[] }>({
  name: 'api-home',
  key: 'home',
  ttl: HOME_CACHE_SECONDS,
  path: '/home',
  label: 'Home',
  isValid: isHomeResponseDto,
  map: (dto) => ({ slides: mapHomeIntroSlides(dto) }),
})

function isHomeResponseDto(value: unknown): value is HomeResponseDto {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false

  const data = value.data
  if (typeof data !== 'object' || data === null || !('slides' in data)) return false

  return Array.isArray(data.slides)
}
