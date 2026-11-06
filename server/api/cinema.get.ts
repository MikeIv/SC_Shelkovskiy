import type { ApiEnvelope } from '#shared/types/api'
import type { CinemaListData } from '#shared/types/cinema'
import { fetchAfishaCinemaFromEvent } from '../utils/afishaApi'
import type { ApiEvent } from '../utils/apiEvent'
import { toApiError } from '../utils/apiProxy'

/**
 * Кино на главной: расписание кинотеатра ТРЦ из Афиши.
 *
 * Данные берём из внутреннего API её виджета — с сервера, потому что браузеру Афиша
 * такие запросы не разрешает (CORS). Любая ошибка (нет ключа или площадки, вендор лежит)
 * уходит наружу ошибкой — `useCinema` подставляет моки с виджетом расписания.
 */

/** Расписание меняется в течение дня: десять минут — компромисс между свежестью и нагрузкой. */
const CACHE_TTL_SECONDS = 600

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
