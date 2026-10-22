/**
 * Тело `GET /awards`: `slug`, `title`, `date` (`YYYY-MM-DD` или `null`), `url`.
 * Пагинации нет — `meta` ручка не отдаёт. Элементы маппер читает как `unknown`.
 */
export type AwardsListResponseDto = {
  data: unknown[]
}

/** Тело `GET /awards/{slug}`: список плюс `subtitle`, `image`, HTML `text`, `seo`. */
export type AwardItemResponseDto = {
  data: unknown
}
