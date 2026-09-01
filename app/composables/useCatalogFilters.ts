import type { UiDropdownOption } from '~/components/ui/Dropdown.vue'
import type { UiSearchOption } from '~/components/ui/Search.vue'
import type { CatalogCardItem, CatalogCardLayout } from '#shared/types/catalog'

function buildSelectOptions(values: string[], placeholder: string): UiDropdownOption[] {
  return [{ value: '', label: placeholder }, ...values.map((value) => ({ value, label: value }))]
}

export interface UseCatalogFiltersOptions {
  categoryPlaceholder?: string
  withCafeFilters?: boolean
}

export function useCatalogFilters(
  items: MaybeRefOrGetter<CatalogCardItem[]>,
  options: UseCatalogFiltersOptions = {},
) {
  const { categoryPlaceholder = 'Категории', withCafeFilters = false } = options
  const source = computed(() => toValue(items))

  const query = ref('')
  const category = ref('')
  const floor = ref('')
  const loyaltyOnly = ref(false)
  const actionsOnly = ref(false)
  const breakfastOnly = ref(false)
  const businessLunchOnly = ref(false)
  const viewMode = ref<CatalogCardLayout>('card')

  const categoryOptions = computed(() =>
    buildSelectOptions(
      [...new Set(source.value.map((item) => item.category))].sort(),
      categoryPlaceholder,
    ),
  )

  const floorOptions = computed(() =>
    buildSelectOptions([...new Set(source.value.map((item) => item.floor))].sort(), 'Все этажи'),
  )

  const searchOptions = computed((): UiSearchOption[] => {
    const seen = new Set<string>()

    return source.value.flatMap((item) => {
      if (seen.has(item.title)) {
        return []
      }

      seen.add(item.title)
      return [{ value: item.id, label: item.title }]
    })
  })

  const filteredItems = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase()

    return source.value.filter((item) => {
      if (normalizedQuery && !item.title.toLowerCase().includes(normalizedQuery)) {
        return false
      }

      if (category.value && item.category !== category.value) {
        return false
      }

      if (floor.value && item.floor !== floor.value) {
        return false
      }

      if (loyaltyOnly.value && !item.tags?.includes('loyalty')) {
        return false
      }

      if (actionsOnly.value && !item.tags?.includes('action')) {
        return false
      }

      if (withCafeFilters && breakfastOnly.value && !item.breakfast) {
        return false
      }

      if (withCafeFilters && businessLunchOnly.value && !item.tags?.includes('lunch')) {
        return false
      }

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
    categoryOptions,
    floorOptions,
    searchOptions,
    filteredItems,
  }
}
