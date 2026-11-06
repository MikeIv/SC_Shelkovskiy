import type { ApiEnvelope } from '#shared/types/api'
import type { CinemaListData } from '#shared/types/cinema'
import { homeCinemaItems } from '~/data/homeCinemaItems'

/**
 * Кино на главной: `GET /api/cinema` — расписание кинотеатра ТРЦ из Афиши.
 *
 * Ручка живёт только в прокси-режиме: в прямом (статический стенд) за ней нет сервера,
 * поэтому ошибка подменяется моками `homeCinemaItems` (`useApiData`) — а раздел вместо
 * заглушек показывает встроенный виджет Афиши. Пустое успешное расписание остаётся пустым:
 * это значит, что сеансов в продаже нет.
 */
export function useCinema() {
  const result = useApiData<ApiEnvelope<CinemaListData>>('/api/cinema', () => ({
    data: { cityId: null, placeId: null, items: [...homeCinemaItems] },
  }))

  const data = computed(() => result.data.value.data)

  return {
    items: computed(() => data.value.items),
    cityId: computed(() => data.value.cityId),
    placeId: computed(() => data.value.placeId),
    isDemo: result.isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
