export type CatalogFiltersVariant = 'shops' | 'cafes' | 'services' | 'entertainment'

export type CatalogFilterTexts = {
  searchLabel: string
  searchPlaceholder: string
  categoryLabel: string
  categoryPlaceholder: string
}

const DEFAULT_CATEGORY_TEXTS = {
  categoryLabel: 'Категория',
  categoryPlaceholder: 'Все категории',
} as const satisfies Pick<CatalogFilterTexts, 'categoryLabel' | 'categoryPlaceholder'>

const CATALOG_FILTER_TEXTS: Record<CatalogFiltersVariant, CatalogFilterTexts> = {
  shops: {
    searchLabel: 'Поиск магазина',
    searchPlaceholder: 'Найти магазин',
    ...DEFAULT_CATEGORY_TEXTS,
  },
  cafes: {
    searchLabel: 'Поиск кафе или ресторана',
    searchPlaceholder: 'Найти кафе или ресторан',
    categoryLabel: 'Тип кухни',
    categoryPlaceholder: 'Тип кухни',
  },
  services: {
    searchLabel: 'Поиск услуги',
    searchPlaceholder: 'Найти услугу',
    ...DEFAULT_CATEGORY_TEXTS,
  },
  entertainment: {
    searchLabel: 'Поиск спорта или развлечения',
    searchPlaceholder: 'Найти спорт или развлечения',
    ...DEFAULT_CATEGORY_TEXTS,
  },
}

export function catalogFilterTexts(variant: CatalogFiltersVariant): CatalogFilterTexts {
  return CATALOG_FILTER_TEXTS[variant]
}
