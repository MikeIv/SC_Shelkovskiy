import type { ApiEnvelope } from '#shared/types/api'
import type { CinemaListData } from '#shared/types/cinema'
import { fetchAfishaCinemaFromEvent } from '../utils/afishaApi'
import type { ApiEvent } from '../utils/apiEvent'
import { toApiError } from '../utils/apiProxy'

/**
 * Кино на главной: расписание кинотеатра ТРЦ из Афиши API v3.
 *
 * Ручка нужна потому, что партнёрский ключ и белый список IP — на сервере: из браузера
 * в Афишу ходить нельзя. Любая ошибка (нет ключа, IP не в списке, вендор лежит) уходит
 * наружу ошибкой — `useCinema` подставляет моки, как и остальные секции главной.
 */

/** Вендор просит не чаще раза в 30 минут: расписание он сам обновляет раз в 10. */
const CACHE_TTL_SECONDS = 1800

export default defineCachedEventHandler(
  async (event: ApiEvent) => {
    try {
      const data = await fetchAfishaCinemaFromEvent(event)
      const body: ApiEnvelope<CinemaListData> = { data }

      return body
    } catch (error) {
      throw toApiError(error, 'Afisha')
    }
  },
  {
    maxAge: CACHE_TTL_SECONDS,
    name: 'api-cinema',
    getKey: () => 'cinema',
  },
)
