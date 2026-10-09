import { isError } from 'h3'
import type { ApiEnvelope } from '#shared/types/api'
import type { HomeResponseDto } from '#shared/types/dto/home'
import type { HomeIntroSlide } from '#shared/types/home'
import { mapHomeIntroSlides } from '#shared/utils/mappers/home'

const HOME_CACHE_SECONDS = 300

export default defineCachedEventHandler(
  async (event) => {
    try {
      const dto = await apiFetch(event)<HomeResponseDto>('/home')

      if (!isHomeResponseDto(dto)) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Home API payload is invalid',
        })
      }

      const body: ApiEnvelope<{ slides: HomeIntroSlide[] }> = {
        data: {
          slides: mapHomeIntroSlides(dto),
        },
      }

      return body
    } catch (error) {
      if (isError(error)) throw error

      throw createError({
        statusCode: upstreamStatus(error),
        statusMessage: 'Home API request failed',
      })
    }
  },
  {
    maxAge: HOME_CACHE_SECONDS,
    name: 'api-home',
    getKey: () => 'home',
  },
)

function isHomeResponseDto(value: unknown): value is HomeResponseDto {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false

  const data = value.data
  if (typeof data !== 'object' || data === null || !('slides' in data)) return false

  return Array.isArray(data.slides)
}

function upstreamStatus(error: unknown): number {
  if (typeof error !== 'object' || error === null) return 502

  const record = error as { statusCode?: unknown; status?: unknown }
  const status = record.statusCode ?? record.status

  if (typeof status === 'number' && status >= 400 && status <= 599) return status

  return 502
}
