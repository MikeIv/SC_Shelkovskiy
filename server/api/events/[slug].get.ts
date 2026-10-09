import { isError } from 'h3'
import type { H3Event } from 'h3'
import type { EventItemResponseDto } from '#shared/types/dto/events'
import type { ApiEnvelope } from '#shared/types/api'
import type { EventDetailItem } from '#shared/types/events'
import { mapEventDetail } from '#shared/utils/mappers/events'
import { isItemPayload } from '../../utils/apiPayload'
import { upstreamStatus } from '../../utils/apiProxy'
import { readApiSlug } from '../../utils/apiQuery'

const EVENT_CACHE_SECONDS = 300

/** Карточка мероприятия: `when`, место, HTML `text`, программа и `seo`. */
export default defineCachedEventHandler(
  async (event: H3Event) => {
    const slug = readApiSlug(event)

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Event slug is invalid',
      })
    }

    try {
      const dto = await apiFetch(event)<EventItemResponseDto>(`/events/${encodeURIComponent(slug)}`)

      if (!isItemPayload(dto)) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Events API payload is invalid',
        })
      }

      const item = mapEventDetail(dto.data)

      if (!item) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Events API payload is invalid',
        })
      }

      const body: ApiEnvelope<EventDetailItem> = { data: item }
      return body
    } catch (error) {
      if (isError(error)) throw error

      throw createError({
        statusCode: upstreamStatus(error),
        statusMessage: 'Events API request failed',
      })
    }
  },
  {
    maxAge: EVENT_CACHE_SECONDS,
    name: 'api-event',
    getKey: (event: H3Event) => `event:${readApiSlug(event)}`,
  },
)
