import type { ApiEnvelope } from '#shared/types/api'
import type { CatalogListData } from '#shared/types/catalog'
import type { TenantCatalog } from '#shared/types/tenantDetail'
import { cafesCatalogItems } from '~/data/cafesCatalogItems'
import { entertainmentCatalogItems } from '~/data/entertainmentCatalogItems'
import { servicesCatalogItems } from '~/data/servicesCatalogItems'
import { shopsCatalogItems } from '~/data/shopsCatalogItems'

const FALLBACK_ITEMS = {
  shops: shopsCatalogItems,
  cafes: cafesCatalogItems,
  services: servicesCatalogItems,
  entertainment: entertainmentCatalogItems,
} as const satisfies Record<TenantCatalog, CatalogListData['items']>

/**
 * Список раздела каталога. Стор резолвится до `await`: после него теряется контекст Pinia.
 * Пустой `NUXT_API_UPSTREAM` (ошибка прокси) оставляет мок этого раздела.
 */
export async function useCatalog(catalog: TenantCatalog) {
  const store = useCatalogStore()
  const fallbackData = fallbackSection(catalog)
  const result = await useApiFetch<ApiEnvelope<CatalogListData>>(`/api/tenants?type=${catalog}`)

  const isFallback = computed(() => result.error.value != null || result.data.value == null)

  const data = computed<CatalogListData>(() => {
    if (isFallback.value || result.data.value == null) return fallbackData
    return result.data.value.data
  })

  watch(
    [data, isFallback],
    () => {
      store.apply(catalog, data.value, isFallback.value)
    },
    { immediate: true },
  )

  return {
    data,
    isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}

function fallbackSection(catalog: TenantCatalog): CatalogListData {
  const items = FALLBACK_ITEMS[catalog]

  return {
    items,
    filters: { categories: [], floors: [] },
    total: items.length,
  }
}
