import type { LayoutResponseDto } from '#shared/types/dto/layout'
import type { LayoutData } from '#shared/types/layout'
import { mapLayout } from '#shared/utils/mappers/layout'
import { defineApiProxy } from '../utils/apiProxy'

const LAYOUT_CACHE_SECONDS = 300

export default defineApiProxy<LayoutResponseDto, LayoutData>({
  name: 'api-layout',
  key: 'layout',
  ttl: LAYOUT_CACHE_SECONDS,
  path: '/layout',
  label: 'Layout',
  isValid: isLayoutResponseDto,
  map: mapLayout,
})

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
