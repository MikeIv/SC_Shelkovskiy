import type { ApiEnvelope } from '#shared/types/api'
import type { VacancyItem } from '#shared/types/vacancies'
import { vacanciesItems } from '~/data/vacanciesPage'

/**
 * Вакансии: `GET /api/vacancies` — все открытые записи без пагинации.
 *
 * Пустой и ошибочный ответ подменяется моком `vacanciesPage` (`useApiData`): аккордеон
 * не пустует, а плашка «демо-данные» показывает, что контент не из админки.
 */
export function useVacancies() {
  const result = useApiData<ApiEnvelope<VacancyItem[]>>('/api/vacancies', () => ({
    data: [...vacanciesItems],
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
