import type { ApiEnvelope } from '#shared/types/api'
import type { EventDetailItem } from '#shared/types/events'
import { getEventDetailBySlug } from '~/data/eventsDetails'

/**
 * Детальная мероприятия.
 * 404 с прокси — страницы нет. Любая другая ошибка (нет upstream) — мок, если slug в нём есть.
 */
export async function useEvent(slug: string) {
  const result = await useApiFetch<ApiEnvelope<EventDetailItem>>(
    `/api/events/${encodeURIComponent(slug)}`,
  )

  const item = computed<EventDetailItem | null>(() => {
    if (result.error.value?.statusCode === 404) return null

    if (result.error.value != null || result.data.value == null) {
      return getEventDetailBySlug(slug) ?? null
    }

    return result.data.value.data
  })

  return {
    item,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
