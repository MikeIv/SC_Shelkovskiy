import type { HomeResponseDto } from '#shared/types/dto/home'
import type { HomePageData } from '#shared/types/home'
import { mapHome } from '#shared/utils/mappers/home'
import { defineApiProxy } from '../utils/apiProxy'

const HOME_CACHE_SECONDS = 300

const HOME_LISTS = ['slides', 'feed', 'brands', 'categories', 'gallery'] as const

export default defineApiProxy<HomeResponseDto, HomePageData>({
  name: 'api-home',
  key: 'home',
  ttl: HOME_CACHE_SECONDS,
  path: '/home',
  label: 'Home',
  isValid: isHomeResponseDto,
  map: mapHome,
})

function isHomeResponseDto(value: unknown): value is HomeResponseDto {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false

  const data = value.data
  if (typeof data !== 'object' || data === null) return false

  const record = data as Record<string, unknown>
  return HOME_LISTS.every((key) => Array.isArray(record[key]))
}
