import type { NewsCardItem } from '#shared/types/news'
import type { TenantStatus } from '#shared/types/catalog'

export type TenantCatalog = 'shops' | 'cafes' | 'services' | 'entertainment'

/** `seo` карточки арендатора. Пустые строки — поля, которых не было в ответе. */
export type TenantSeo = {
  title: string
  description: string
  keywords: string
  ogImage: string
}

/**
 * Карточка описания арендатора.
 * `about` — HTML из API (бэкенд отдаёт очищенную строку).
 * `status`, `podium`, `assortment`, `workingHours` на странице не выводятся:
 * схемы `working_hours[]` в OpenAPI нет, на стенде массив пустой.
 */
export type TenantDetail = {
  slug: string
  catalog: TenantCatalog
  title: string
  category: string
  floor: string
  logoSrc: string
  logoAlt: string
  mapUrl: string
  status: TenantStatus
  podium: string
  assortment: string | null
  workingHours: unknown[]
  seo: TenantSeo | null
  phone?: string
  phoneHref?: string
  website?: string
  aboutTitle?: string
  about?: string
  gallery?: string[]
  galleryAlt?: string
  news: NewsCardItem[]
}
