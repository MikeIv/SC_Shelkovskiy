import type { ApiEnvelope } from '#shared/types/api'
import type { NewsCardItem, NewsDetailData, NewsDetailItem } from '#shared/types/news'
import { mapHomeFeed } from '#shared/utils/mappers/home'
import { mapNewsDetail } from '#shared/utils/mappers/news'
import { newsRelatedKind } from '#shared/utils/newsTag'
import type { ApiEvent } from '../../utils/apiEvent'
import { isItemPayload, isListPayload } from '../../utils/apiPayload'
import { upstreamStatus } from '../../utils/apiProxy'
import { readApiSlug } from '../../utils/apiQuery'

const FEED_ITEM_CACHE_SECONDS = 300
const RELATED_LIMIT = 4

/**
 * Детальная записи ленты и связанные материалы того же раздела
 * (`/feed?exclude={slug}`): для новостей — всё, кроме СМИ, для акций и СМИ — свой `type`.
 */
export default defineCachedEventHandler(
  async (event: ApiEvent) => {
    const slug = readApiSlug(event)

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Feed slug is invalid',
      })
    }

    try {
      const dto = await apiFetch(event)<unknown>(`/feed/${encodeURIComponent(slug)}`)

      if (!isItemPayload(dto)) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Feed API payload is invalid',
        })
      }

      const item = mapNewsDetail(dto.data)

      if (!item) {
        throw createError({
          statusCode: 502,
          statusMessage: 'Feed API payload is invalid',
        })
      }

      const related = await loadRelated(event, item)
      const body: ApiEnvelope<NewsDetailData> = { data: { item, related } }

      return body
    } catch (error) {
      if (isError(error)) throw error

      throw createError({
        statusCode: upstreamStatus(error),
        statusMessage: 'Feed API request failed',
      })
    }
  },
  {
    maxAge: FEED_ITEM_CACHE_SECONDS,
    name: 'api-feed-item',
    getKey: (event: ApiEvent) => `feed:${readApiSlug(event)}`,
  },
)

/** Сбой связанных не роняет детальную: секция просто не выводится. */
async function loadRelated(event: ApiEvent, item: NewsDetailItem): Promise<NewsCardItem[]> {
  const kind = newsRelatedKind(item.tagVariant)

  try {
    const dto = await apiFetch(event)<unknown>('/feed', {
      query: {
        exclude: item.id,
        per_page: RELATED_LIMIT,
        ...(kind === 'news' ? {} : { type: kind }),
      },
    })

    if (!isListPayload(dto)) return []

    return mapHomeFeed(dto.data).slice(0, RELATED_LIMIT)
  } catch {
    return []
  }
}
