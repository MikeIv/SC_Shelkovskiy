/** Раздел глобального поиска по сайту. */
export type SearchSectionId =
  'shops' | 'cafes' | 'services' | 'entertainment' | 'news' | 'events' | 'awards'

/** Элемент выдачи поиска. */
export type SearchHit = {
  id: string
  sectionId: SearchSectionId
  title: string
  /** Этаж / тип / дата — серый текст справа. */
  meta: string
  to: string
}

/** Группа результатов по разделу. */
export type SearchResultGroup = {
  id: SearchSectionId
  label: string
  items: SearchHit[]
}
