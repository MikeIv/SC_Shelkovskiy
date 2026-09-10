import type { CatalogCardItem } from '#shared/types/catalog'
import type { TenantCatalog } from '#shared/types/tenantDetail'

export const tenantCatalogs = [
  'shops',
  'cafes',
  'services',
  'entertainment',
] as const satisfies readonly TenantCatalog[]

export function isTenantCatalog(value: string): value is TenantCatalog {
  return (tenantCatalogs as readonly string[]).includes(value)
}

export function tenantCatalogPath(catalog: TenantCatalog): `/${TenantCatalog}` {
  return `/${catalog}`
}

/** Нормализует id карточки (убирает суффикс дубликата для каталога). */
export function normalizeTenantSlug(id: string): string {
  return id.replace(/-dup-\d+$/, '')
}

/** URL страницы арендатора. */
export function getTenantDetailPath(catalog: TenantCatalog, id: string): string {
  return `${tenantCatalogPath(catalog)}/${normalizeTenantSlug(id)}`
}

export function withTenantDetailLinks(
  catalog: TenantCatalog,
  items: readonly CatalogCardItem[],
): CatalogCardItem[] {
  return items.map((item) => ({
    ...item,
    to: item.to ?? getTenantDetailPath(catalog, item.tenantId ?? item.id),
  }))
}
