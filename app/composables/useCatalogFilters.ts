import type { UiDropdownOption } from '~/components/ui/Dropdown.vue'
import type { UiSearchOption } from '~/components/ui/Search.vue'
import type { CatalogCardItem, CatalogCardLayout, CatalogFilterChoice } from '#shared/types/catalog'
import type { TenantCatalog } from '#shared/types/tenantDetail'

function buildSelectOptions(values: string[], placeholder: string): UiDropdownOption[] {
  return [{ value: '', label: placeholder }, ...values.map((value) => ({ value, label: value }))]
}

function choicesToOptions(
  choices: CatalogFilterChoice[],
  placeholder: string,
  withCount = true,
): UiDropdownOption[] {
  return [
    { value: '', label: placeholder },
    ...choices.map((choice) => ({
      value: choice.value,
      label: choice.label,
      ...(withCount ? { count: choice.count } : {}),
    })),
  ]
}

export interface UseCatalogFiltersOptions {
  categoryPlaceholder?: string
}

/**
 * Фильтры раздела. Карточки и счётчики читает из `useCatalogStore` —
 * страница сначала вызывает `useCatalog`.
 */
export function useCatalogFilters(catalog: TenantCatalog, options: UseCatalogFiltersOptions = {}) {
  const { categoryPlaceholder = 'Все категории' } = options
  const store = useCatalogStore()
  const source = computed(() => store.sections[catalog]?.items ?? [])
  const apiFilters = computed(() => store.sections[catalog]?.filters)

  const query = ref('')
  const category = ref('')
  const floor = ref('')
  const loyaltyOnly = ref(false)
  const actionsOnly = ref(false)
  const breakfastOnly = ref(false)
  const businessLunchOnly = ref(false)
  const viewMode = ref<CatalogCardLayout>('card')

  const showBreakfast = computed(() => source.value.some((item) => item.breakfast))
  const showBusinessLunch = computed(() =>
    source.value.some((item) => item.tags?.includes('lunch')),
  )

  const categoryOptions = computed(() => {
    const fromApi = apiFilters.value?.categories ?? []
    if (fromApi.length) return choicesToOptions(fromApi, categoryPlaceholder)

    return buildSelectOptions(
      [...new Set(source.value.map((item) => item.category).filter(Boolean))].sort(),
      categoryPlaceholder,
    )
  })

  const floorOptions = computed(() => {
    const fromApi = apiFilters.value?.floors ?? []
    if (fromApi.length) return choicesToOptions(fromApi, 'Все этажи', false)

    return buildSelectOptions(
      [...new Set(source.value.map((item) => item.floor).filter(Boolean))].sort(),
      'Все этажи',
    )
  })

  const searchOptions = computed((): UiSearchOption[] => {
    const seen = new Set<string>()

    return source.value.flatMap((item) => {
      if (seen.has(item.title)) return []

      seen.add(item.title)
      return [{ value: item.id, label: item.title }]
    })
  })

  const filteredItems = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase()

    return source.value.filter((item) => {
      if (normalizedQuery && !item.title.toLowerCase().includes(normalizedQuery)) return false
      if (!matchesCategory(item, category.value)) return false
      if (floor.value && item.floor !== floor.value) return false
      if (loyaltyOnly.value && !item.tags?.includes('loyalty')) return false
      if (actionsOnly.value && !item.tags?.includes('action')) return false
      if (breakfastOnly.value && !item.breakfast) return false
      if (businessLunchOnly.value && !item.tags?.includes('lunch')) return false

      return true
    })
  })

  return {
    query,
    category,
    floor,
    loyaltyOnly,
    actionsOnly,
    breakfastOnly,
    businessLunchOnly,
    viewMode,
    showBreakfast,
    showBusinessLunch,
    categoryOptions,
    floorOptions,
    searchOptions,
    filteredItems,
  }
}

function matchesCategory(item: CatalogCardItem, selected: string): boolean {
  if (!selected) return true
  if (item.categorySlug) return item.categorySlug === selected
  return item.category === selected
}
