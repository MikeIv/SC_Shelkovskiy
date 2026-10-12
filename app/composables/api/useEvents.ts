import type { ApiEnvelope } from '#shared/types/api'
import type { EventsListData } from '#shared/types/events'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'
import { eventsAfishaItems } from '~/data/eventsItems'

/** Максимум страницы на стенде; афиша небольшая, берём весь раздел одним запросом. */
const PER_PAGE = 50

/**
 * Афиша `/events`. Ошибка прокси (нет upstream) — карточки мока; пустой успешный ответ
 * остаётся пустым: на стенде он означает, что мероприятий нет.
 */
export async function useEvents() {
  const result = await useApiFetch<ApiEnvelope<EventsListData>>(
    `/api/events?page=1&per_page=${PER_PAGE}`,
  )

  const isFallback = computed(() => result.error.value != null || result.data.value == null)

  const data = computed<EventsListData>(() => {
    if (isFallback.value || result.data.value == null) {
      return { items: eventsAfishaItems, meta: null }
    }

    return result.data.value.data
  })

  watch(
    isFallback,
    (fallbackUsed) => {
      if (fallbackUsed) markDemoData('/api/events')
      else unmarkDemoData('/api/events')
    },
    { immediate: true },
  )

  return {
    data,
    items: computed(() => data.value.items),
    isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
