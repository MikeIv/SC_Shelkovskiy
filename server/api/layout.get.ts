import { isError } from 'h3'
import type { ApiEnvelope } from '#shared/types/api'
import type { LayoutResponseDto } from '#shared/types/dto/layout'
import type { LayoutData } from '#shared/types/layout'
import { mapLayout } from '#shared/utils/mappers/layout'

const LAYOUT_CACHE_SECONDS = 300

export default defineCachedEventHandler(
  async (event) => {
    try {
      const dto = await apiFetch(event)<LayoutResponseDto>('/layout')

      if (!isLayoutResponseDto(dto)) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Layout API payload is invalid',
        })
      }

      const body: ApiEnvelope<LayoutData> = {
        data: mapLayout(dto),
      }

      return body
    } catch (error) {
      if (isError(error)) throw error

      throw createError({
        statusCode: upstreamStatus(error),
        statusMessage: 'Layout API request failed',
      })
    }
  },
  {
    maxAge: LAYOUT_CACHE_SECONDS,
    name: 'api-layout',
    getKey: () => 'layout',
  },
)

function isLayoutResponseDto(value: unknown): value is LayoutResponseDto {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false

  const data = value.data
  if (typeof data !== 'object' || data === null) return false

  const record = data as Record<string, unknown>
  return (
    isObject(record.contacts) &&
    isArrayField(record.contacts, 'departments') &&
    isObject(record.hours) &&
    isArrayField(record.hours, 'week') &&
    isArrayField(record.hours, 'exceptions') &&
    isArrayField(record.hours, 'tenants') &&
    Array.isArray(record.socials) &&
    isObject(record.apps) &&
    isObject(record.cta_max)
  )
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isArrayField(value: Record<string, unknown>, key: string): boolean {
  return Array.isArray(value[key])
}

function upstreamStatus(error: unknown): number {
  if (typeof error !== 'object' || error === null) return 502

  const record = error as { statusCode?: unknown; status?: unknown }
  const status = record.statusCode ?? record.status

  if (typeof status === 'number' && status >= 400 && status <= 599) return status

  return 502
}
