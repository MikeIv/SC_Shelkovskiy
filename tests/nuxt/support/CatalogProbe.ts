import { defineComponent, h } from 'vue'
import type { TenantCatalog } from '#shared/types/tenantDetail'

/** Пробник `useCatalog`: значения в атрибутах, без разметки страницы. */
export const CatalogProbe = defineComponent({
  props: {
    catalog: { type: String, required: true },
  },
  async setup(props) {
    const catalog = props.catalog as TenantCatalog
    clearNuxtData()
    const { filteredItems, categoryOptions, showBreakfast, showBusinessLunch } =
      useCatalogFilters(catalog)
    const store = useCatalogStore()

    await useCatalog(catalog)

    return () =>
      h('div', {
        'data-total': String(store.sections[catalog]?.total ?? ''),
        'data-count': String(filteredItems.value.length),
        'data-first': filteredItems.value[0]?.title ?? '',
        'data-odezhda': String(
          categoryOptions.value.find((option) => option.value === 'odezhda')?.count ?? '',
        ),
        'data-breakfast': String(showBreakfast.value),
        'data-lunch': String(showBusinessLunch.value),
        'data-fallback': String(store.fallbacks[catalog] ?? ''),
      })
  },
})

/** Пробник `useTenant`. */
export const TenantProbe = defineComponent({
  props: {
    catalog: { type: String, required: true },
    slug: { type: String, required: true },
  },
  async setup(props) {
    const { item } = await useTenant(props.catalog as TenantCatalog, props.slug)

    return () =>
      h('div', {
        'data-title': item.value?.title ?? '',
        'data-catalog': item.value?.catalog ?? '',
        'data-news': String(item.value?.news.length ?? ''),
        'data-about': item.value?.about ?? '',
      })
  },
})
