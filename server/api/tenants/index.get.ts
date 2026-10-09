import type { CatalogListData } from '#shared/types/catalog'
import type { TenantsListResponseDto } from '#shared/types/dto/tenants'
import { mapTenantsList } from '#shared/utils/mappers/tenants'
import { isTenantCatalog } from '#shared/utils/tenantPath'
import type { ApiEvent } from '../../utils/apiEvent'
import { defineApiProxy } from '../../utils/apiProxy'

const TENANTS_CACHE_SECONDS = 300

/**
 * Весь раздел одним запросом. Живой `/tenants` не пагинирует: `meta` — только `filters`,
 * `page` и `per_page` возвращают тот же список. Агрегация страниц задвоила бы карточки.
 */
export default defineApiProxy<TenantsListResponseDto, CatalogListData>({
  name: 'api-tenants',
  key: (event) => `tenants:${catalogQuery(event)}`,
  ttl: TENANTS_CACHE_SECONDS,
  path: (event) => {
    const type = catalogQuery(event)

    if (!isTenantCatalog(type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Catalog type is invalid',
      })
    }

    return `/tenants?type=${encodeURIComponent(type)}`
  },
  label: 'Tenants',
  isValid: isTenantsListResponseDto,
  map: mapTenantsList,
})

function catalogQuery(event: ApiEvent): string {
  const type = getQuery(event).type
  return typeof type === 'string' ? type : ''
}

function isTenantsListResponseDto(value: unknown): value is TenantsListResponseDto {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false
  return Array.isArray(value.data)
}
