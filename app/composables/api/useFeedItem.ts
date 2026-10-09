import type { ApiEnvelope } from '#shared/types/api'
import type { NewsCardItem, NewsDetailData, NewsDetailItem } from '#shared/types/news'
import { getNewsDetailBySlug, getRelatedNewsItems } from '~/data/newsDetails'

/**
 * Детальная записи ленты и связанные материалы.
 * 404 с прокси — страницы нет. Любая другая ошибка (нет upstream) — мок, если slug в нём есть.
 */
export async function useFeedItem(slug: string) {
  const result = await useApiFetch<ApiEnvelope<NewsDetailData>>(
    `/api/feed/${encodeURIComponent(slug)}`,
  )

  const isMissing = computed(() => result.error.value?.statusCode === 404)

  const item = computed<NewsDetailItem | null>(() => {
    if (isMissing.value) return null

    if (result.error.value != null || result.data.value == null) {
      return getNewsDetailBySlug(slug) ?? null
    }

    return result.data.value.data.item
  })

  const related = computed<NewsCardItem[]>(() => {
    if (isMissing.value) return []

    if (result.error.value != null || result.data.value == null) return getRelatedNewsItems(slug)
    return result.data.value.data.related
  })

  return {
    item,
    related,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
