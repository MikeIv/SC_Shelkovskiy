import type { CatalogCardItem } from '#shared/types/catalog'
import type { SearchHit, SearchResultGroup, SearchSectionId } from '#shared/types/search'
import { getNewsDetailPath } from '#shared/utils/newsPath'
import { getAwardsDetailPath } from '#shared/utils/awardsPath'
import { getEventDetailPath } from '#shared/utils/eventsPath'
import { awardsItems } from '~/data/awardsPage'
import { cafesCatalogItems } from '~/data/cafesCatalogItems'
import { entertainmentCatalogItems } from '~/data/entertainmentCatalogItems'
import { eventsAfishaItems } from '~/data/eventsItems'
import { newsCatalogItems } from '~/data/newsCatalogItems'
import { servicesCatalogItems } from '~/data/servicesCatalogItems'
import { shopsCatalogItems } from '~/data/shopsCatalogItems'

type SearchSectionDef = {
  id: SearchSectionId
  label: string
}

/** Порядок разделов в выдаче (как в ТЗ). */
const searchSections: readonly SearchSectionDef[] = [
  { id: 'shops', label: 'Магазины' },
  { id: 'cafes', label: 'Кафе и рестораны' },
  { id: 'services', label: 'Услуги' },
  { id: 'entertainment', label: 'Спорт и развлечения' },
  { id: 'news', label: 'Новости и акции' },
  { id: 'events', label: 'Мероприятия' },
  { id: 'awards', label: 'Награды' },
]

function uniqueByKey<T>(items: readonly T[], keyOf: (item: T) => string): T[] {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = keyOf(item)
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function catalogHits(
  sectionId: SearchSectionId,
  items: CatalogCardItem[],
  listPath: string,
): SearchHit[] {
  return uniqueByKey(items, (item) => item.title.trim().toLowerCase()).map((item) => ({
    id: `${sectionId}-${item.id}`,
    sectionId,
    title: item.title,
    meta: item.floor,
    to: item.to ?? listPath,
  }))
}

/** Мок индекса до контракта API. */
const searchIndex: SearchHit[] = [
  ...catalogHits('shops', shopsCatalogItems, '/shops'),
  ...catalogHits('cafes', cafesCatalogItems, '/cafes'),
  ...catalogHits('services', servicesCatalogItems, '/services'),
  ...catalogHits('entertainment', entertainmentCatalogItems, '/entertainment'),
  ...uniqueByKey(
    newsCatalogItems.map((item) => ({
      id: `news-${item.id}`,
      sectionId: 'news' as const,
      title: item.title,
      meta: item.tagLabel,
      to: item.to ?? getNewsDetailPath(item.id),
    })),
    (item) => item.title.trim().toLowerCase(),
  ),
  ...eventsAfishaItems.map((item) => ({
    id: `events-${item.id}`,
    sectionId: 'events' as const,
    title: item.title,
    meta: `${item.dateStart.day} ${item.dateStart.month}`,
    to: item.to ?? getEventDetailPath(item.id),
  })),
  ...awardsItems.map((item) => ({
    id: `awards-${item.id}`,
    sectionId: 'awards' as const,
    title: item.title,
    meta: item.date,
    to: getAwardsDetailPath(item.id),
  })),
]

export const searchEmptyMessage = 'По вашему запросу ничего не найдено'

/**
 * Фильтрует мок-индекс и группирует по разделам.
 * Пустой запрос → пустой список (без empty-state).
 */
export function searchSite(query: string): SearchResultGroup[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return []
  }

  const buckets = new Map<SearchSectionId, SearchHit[]>()

  for (const hit of searchIndex) {
    if (
      !hit.title.toLowerCase().includes(normalized) &&
      !hit.meta.toLowerCase().includes(normalized)
    ) {
      continue
    }

    const bucket = buckets.get(hit.sectionId)
    if (bucket) {
      bucket.push(hit)
    } else {
      buckets.set(hit.sectionId, [hit])
    }
  }

  return searchSections.flatMap((section) => {
    const items = buckets.get(section.id)
    return items?.length ? [{ id: section.id, label: section.label, items }] : []
  })
}
