import type { ApiEnvelope } from '#shared/types/api'
import type { EventDetailItem } from '#shared/types/events'
import { apiErrorInfo } from '#shared/api/errors'
import { getEventDetailBySlug } from '~/data/eventsDetails'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'

/**
 * Детальная мероприятия.
 * 404 — страницы нет. Сбой API (5xx, таймаут, CORS) — демо-мероприятие, если slug в нём есть;
 * иначе ошибка с настоящим кодом, без подмены на 404.
 */
export async function useEvent(slug: string) {
  const result = await useApiFetch<ApiEnvelope<EventDetailItem>>(
    `/api/events/${encodeURIComponent(slug)}`,
  )

  const source = `/api/events/${slug}`
  const isMissing = computed(() => result.error.value?.statusCode === 404)
  const usesDemo = computed(
    () => !isMissing.value && (result.error.value != null || result.data.value == null),
  )

  const item = computed<EventDetailItem | null>(() => {
    if (isMissing.value) return null

    if (usesDemo.value) {
      const demo = getEventDetailBySlug(slug)

      if (demo) return demo

      throw createError(apiErrorInfo(result.error.value))
    }

    return result.data.value?.data ?? null
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
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
