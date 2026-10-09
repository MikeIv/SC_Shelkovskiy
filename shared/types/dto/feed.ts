import type { ApiListMeta } from '#shared/types/api'

/**
 * Тело `GET /feed`. Схемы элементов в OpenAPI нет: маппер читает их как `unknown`
 * и пропускает нераспознанные (`docs/api/samples/feed_page_1_per_page_2.json`).
 */
export type FeedListResponseDto = {
  data: unknown[]
  meta?: ApiListMeta
}

/** Тело `GET /feed/{slug}`: поля карточки плюс `text` (HTML), `gallery`, `tenant`, `seo`. */
export type FeedItemResponseDto = {
  data: unknown
}
