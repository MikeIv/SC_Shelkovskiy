/**
 * Тело `GET /tenants?type=`.
 * Живой ответ — весь раздел без пагинации: `meta` содержит только `filters`.
 * Элементы списка и фильтров маппер читает как `unknown` и отбрасывает нераспознанные.
 */
export type TenantsListResponseDto = {
  data: unknown[]
  meta?: {
    filters?: {
      categories?: unknown[]
      floors?: unknown[]
    }
  }
}

/** Тело `GET /tenants/{slug}`. Поля сверх списка маппит `mapTenantDetail`. */
export type TenantDetailResponseDto = {
  data: unknown
}
