import type { H3Event } from 'h3'
import type { FeedListResponseDto } from '#shared/types/dto/feed'
import type { NewsFilterTab, NewsListData } from '#shared/types/news'
import { isNewsFilterTab } from '#shared/utils/newsTag'
import { mapFeedList } from '#shared/utils/mappers/news'
import { isListPayload } from '../../utils/apiPayload'
import { readApiNumber } from '../../utils/apiQuery'
import { defineApiProxy } from '../../utils/apiProxy'

const FEED_CACHE_SECONDS = 60
const DEFAULT_PER_PAGE = 12
const MAX_PER_PAGE = 50

/**
 * Страница ленты: `type` — вкладка (`news|action|smi`), `page`/`per_page` — пагинация Laravel.
 * Без `type` живой `/feed` отдаёт новости и акции; СМИ приходят только с `type=smi`.
 */
export default defineApiProxy<FeedListResponseDto, NewsListData>({
  name: 'api-feed',
  key: (event) => {
    const { type, page, perPage } = readFeedQuery(event)
    return `feed:${type ?? 'all'}:${page}:${perPage}`
  },
  ttl: FEED_CACHE_SECONDS,
  path: (event) => {
    const { type, page, perPage } = readFeedQuery(event)
    const params = new URLSearchParams({ page: String(page), per_page: String(perPage) })

    if (type) params.set('type', type)

    return `/feed?${params.toString()}`
  },
  label: 'Feed',
  isValid: isFeedListResponseDto,
  map: mapFeedList,
})

type FeedQuery = {
  type: NewsFilterTab | null
  page: number
  perPage: number
}

function readFeedQuery(event: H3Event): FeedQuery {
  const query = getQuery(event)

  return {
    type: readType(query.type),
    page: readApiNumber(query.page, 1, 1, Number.MAX_SAFE_INTEGER, 'Feed page is invalid'),
    perPage: readApiNumber(
      query.per_page,
      DEFAULT_PER_PAGE,
      1,
      MAX_PER_PAGE,
      'Feed per_page is invalid',
    ),
  }
}

function readType(value: unknown): NewsFilterTab | null {
  if (value === undefined || value === null || value === '') return null

  if (typeof value !== 'string' || !isNewsFilterTab(value)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Feed type is invalid',
    })
  }

  return value
}

/** Проверка формы ответа через общий предикат: тип DTO остаётся контрактом ручки. */
function isFeedListResponseDto(value: unknown): value is FeedListResponseDto {
  return isListPayload(value)
}
