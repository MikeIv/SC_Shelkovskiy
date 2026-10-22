import type { ApiEnvelope } from '#shared/types/api'
import type { AwardsItem } from '#shared/types/awards'
import { awardsItems } from '~/data/awardsPage'

/**
 * Награды `/awards`: `GET /api/awards` — все записи без пагинации.
 *
 * Ошибочный ответ подменяется моком `awardsPage` (`useApiData`). Пустой успешный
 * список остаётся пустым: на стенде это значит, что материалов нет.
 */
export function useAwards() {
  const result = useApiData<ApiEnvelope<AwardsItem[]>>('/api/awards', () => ({
    data: [...awardsItems],
  }))

  const items = computed(() => result.data.value.data)

  return {
    items,
    isFallback: result.isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
