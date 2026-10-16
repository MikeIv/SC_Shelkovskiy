/**
 * `GET /pages/{slug}`. Блоки в OpenAPI — таблица `type` → `data`; неизвестные типы
 * маппер пропускает. Схемы элементов `blocks[]` не строгие: элементы — `unknown`.
 */
export type PageResponseDto = {
  data: {
    slug: string
    title: string | null
    blocks: unknown[]
    seo: unknown
  }
}
