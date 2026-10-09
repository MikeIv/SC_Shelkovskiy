import type { ApiListMeta } from '#shared/types/api'

/**
 * Тело `GET /events`: `slug`, `title`, `tag`, `image`, `starts_at` (ISO-дата), `ends_at`,
 * `preview_text`, `url` + `meta`. Элементы маппер читает как `unknown`.
 */
export type EventsListResponseDto = {
  data: unknown[]
  meta?: ApiListMeta
}

/** Тело `GET /events/{slug}`: список плюс `time`, `location`, `floor`, `text`, `gallery`, `program`, `seo`. */
export type EventItemResponseDto = {
  data: unknown
}
