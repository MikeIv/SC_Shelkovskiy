import type { ApiEnvelope } from '#shared/types/api'
import type { TenantCatalog, TenantDetail } from '#shared/types/tenantDetail'
import { getTenantDetailBySlug } from '~/data/tenantDetails'

/**
 * Карточка арендатора.
 * 404 с прокси — страницы нет. Любая другая ошибка (нет upstream) — мок, если slug в нём есть.
 */
export async function useTenant(catalog: TenantCatalog, slug: string) {
  const result = await useApiFetch<ApiEnvelope<TenantDetail>>(
    `/api/tenants/${encodeURIComponent(slug)}`,
  )

  const item = computed<TenantDetail | null>(() => {
    if (result.error.value?.statusCode === 404) return null

    if (result.error.value != null || result.data.value == null) {
      return getTenantDetailBySlug(catalog, slug) ?? null
    }

    return result.data.value.data
  })

  return {
    item,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
