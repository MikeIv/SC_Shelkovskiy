import type { NewsCardItem } from '#shared/types/news'

export type TenantCatalog = 'shops' | 'cafes' | 'services' | 'entertainment'

/** Карточка описания арендатора (магазин / кафе / услуга / развлечение). */
export type TenantDetail = {
  slug: string
  catalog: TenantCatalog
  title: string
  category: string
  floor: string
  logoSrc: string
  logoAlt: string
  mapUrl: string
  phone?: string
  phoneHref?: string
  website?: string
  aboutTitle?: string
  about?: string[]
  gallery?: string[]
  galleryAlt?: string
  news: NewsCardItem[]
}
