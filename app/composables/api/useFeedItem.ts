import type { ApiEnvelope } from '#shared/types/api'
import type { NewsCardItem, NewsDetailData, NewsDetailItem } from '#shared/types/news'
import { apiErrorInfo } from '#shared/api/errors'
import { getNewsDetailBySlug, getRelatedNewsItems } from '~/data/newsDetails'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'

/**
 * Детальная записи ленты и связанные материалы.
 * 404 — страницы нет. Сбой API (5xx, таймаут, CORS) — демо-запись, если slug в ней есть;
 * иначе ошибка с настоящим кодом, без подмены на 404. Отсутствие ответа ошибкой не считаем:
 * до данных запись пустая, а не битая.
 */
export async function useFeedItem(slug: string) {
  const result = await useApiFetch<ApiEnvelope<NewsDetailData>>(
    `/api/feed/${encodeURIComponent(slug)}`,
  )

  const source = `/api/feed/${slug}`
  const isMissing = computed(() => result.error.value?.statusCode === 404)
  const usesDemo = computed(
    () => !isMissing.value && (result.error.value != null || result.data.value == null),
  )

  const demoDetail = computed(() => getNewsDetailBySlug(slug) ?? null)

  const item = computed<NewsDetailItem | null>(() => {
    if (isMissing.value) return null

    if (usesDemo.value) {
      const demo = demoDetail.value

      if (demo) return demo

      /**
       * Ошибка без демо-записи — наружу настоящий код. Пока ответа нет (данные сброшены,
       * запрос в полёте), ошибки тоже нет: показывать нечего, но и падать не из-за чего.
       */
      const error = result.error.value

      if (error == null) return null

      throw createError(apiErrorInfo(error))
    }

    return result.data.value?.data.item ?? null
  })

  const related = computed<NewsCardItem[]>(() => {
    if (isMissing.value) return []

    if (usesDemo.value) return getRelatedNewsItems(slug)
    return result.data.value?.data.related ?? []
  })

  watch(
    usesDemo,
    (demoUsed) => {
      if (demoUsed) markDemoData(source)
      else unmarkDemoData(source)
    },
    { immediate: true },
  )

  return {
    item,
    related,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
