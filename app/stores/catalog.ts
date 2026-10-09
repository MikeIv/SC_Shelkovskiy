import type { CatalogListData } from '#shared/types/catalog'
import type { TenantCatalog } from '#shared/types/tenantDetail'

/** Списки каталога по разделу. Пишет только `useCatalog`. */
export const useCatalogStore = defineStore('catalog', () => {
  const sections = ref<Partial<Record<TenantCatalog, CatalogListData>>>({})
  const fallbacks = ref<Partial<Record<TenantCatalog, boolean>>>({})

  function apply(catalog: TenantCatalog, data: CatalogListData, isFallback: boolean) {
    sections.value = { ...sections.value, [catalog]: data }
    fallbacks.value = { ...fallbacks.value, [catalog]: isFallback }
  }

  return {
    sections,
    fallbacks,
    apply,
  }
})
