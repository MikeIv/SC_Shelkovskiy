import { isError } from 'h3'
import type { H3Event } from 'h3'
import type { ApiEnvelope } from '#shared/types/api'
import type { NewsCardItem } from '#shared/types/news'
import type { TenantDetail } from '#shared/types/tenantDetail'
import { mapHomeFeed } from '#shared/utils/mappers/home'
import { mapTenantDetail } from '#shared/utils/mappers/tenants'
import { upstreamStatus } from '../../utils/apiProxy'

const TENANT_CACHE_SECONDS = 300

/**
 * Карточка арендатора и отдельно его лента `GET /feed?tenant=`.
 * Сбой ленты не роняет карточку: блок новостей просто пустой.
 */
export default defineCachedEventHandler(
  async (event: H3Event) => {
    const slug = readSlug(event)

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tenant slug is invalid',
      })
    }

    try {
      const [dto, news] = await Promise.all([
        apiFetch(event)<unknown>(`/tenants/${encodeURIComponent(slug)}`),
        loadTenantNews(event, slug),
      ])

      if (!isTenantPayload(dto)) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Tenant API payload is invalid',
        })
      }

      const detail = mapTenantDetail(dto.data, news)

      if (!detail) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Tenant API payload is invalid',
        })
      }

      const body: ApiEnvelope<TenantDetail> = { data: detail }
      return body
    } catch (error) {
      if (isError(error)) throw error

      throw createError({
        statusCode: upstreamStatus(error),
        statusMessage: 'Tenant API request failed',
      })
    }
  },
  {
    maxAge: TENANT_CACHE_SECONDS,
    name: 'api-tenant',
    getKey: (event: H3Event) => `tenant:${readSlug(event)}`,
  },
)

async function loadTenantNews(event: H3Event, slug: string): Promise<NewsCardItem[]> {
  try {
    const dto = await apiFetch(event)<unknown>('/feed', {
      query: { tenant: slug, limit: 50 },
    })

    if (!isFeedPayload(dto)) return []

    return mapHomeFeed(dto.data)
  } catch {
    return []
  }
}

function readSlug(event: H3Event): string {
  const slug = getRouterParam(event, 'slug')
  return typeof slug === 'string' ? slug : ''
}

function isTenantPayload(value: unknown): value is { data: unknown } {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false
  const data = value.data
  return typeof data === 'object' && data !== null && !Array.isArray(data)
}

function isFeedPayload(value: unknown): value is { data: unknown[] } {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false
  return Array.isArray(value.data)
}
