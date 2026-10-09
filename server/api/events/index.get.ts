import type { EventsListResponseDto } from '#shared/types/dto/events'
import type { EventsListData } from '#shared/types/events'
import { mapEventsList } from '#shared/utils/mappers/events'
import type { ApiEvent } from '../../utils/apiEvent'
import { isListPayload } from '../../utils/apiPayload'
import { readApiNumber } from '../../utils/apiQuery'
import { defineApiProxy } from '../../utils/apiProxy'

const EVENTS_CACHE_SECONDS = 60
const DEFAULT_PER_PAGE = 12
const MAX_PER_PAGE = 50

/** Афиша: `page`/`per_page` — пагинация Laravel, на стенде 3 записи. */
export default defineApiProxy<EventsListResponseDto, EventsListData>({
  name: 'api-events',
  key: (event) => {
    const { page, perPage } = readEventsQuery(event)
    return `events:${page}:${perPage}`
  },
  ttl: EVENTS_CACHE_SECONDS,
  path: (event) => {
    const { page, perPage } = readEventsQuery(event)
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) })

    return `/events?${params.toString()}`
  },
  label: 'Events',
  isValid: isEventsListResponseDto,
  map: mapEventsList,
})

function readEventsQuery(event: ApiEvent): { page: number; perPage: number } {
  const query = getQuery(event)

  return {
    page: readApiNumber(query.page, 1, 1, Number.MAX_SAFE_INTEGER, 'Events page is invalid'),
    perPage: readApiNumber(
      query.per_page,
      DEFAULT_PER_PAGE,
      1,
      MAX_PER_PAGE,
      'Events per_page is invalid',
    ),
  }
}

/** Проверка формы ответа через общий предикат: тип DTO остаётся контрактом ручки. */
function isEventsListResponseDto(value: unknown): value is EventsListResponseDto {
  return isListPayload(value)
}
