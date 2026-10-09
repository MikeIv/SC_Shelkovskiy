import type {
  CatalogCardItem,
  CatalogCardTag,
  CatalogFilterChoice,
  CatalogListData,
  TenantStatus,
} from '#shared/types/catalog'
import type { TenantsListResponseDto } from '#shared/types/dto/tenants'
import type { NewsCardItem } from '#shared/types/news'
import type { TenantDetail, TenantSeo } from '#shared/types/tenantDetail'
import { isTenantCatalog } from '#shared/utils/tenantPath'
import { resolveAlt } from '#shared/utils/resolveAlt'

const CARD_TAGS = new Set<CatalogCardTag>(['loyalty', 'action', 'lunch'])
const STATUSES = new Set<TenantStatus>(['none', 'new', 'soon'])

export function mapTenantsList(dto: TenantsListResponseDto): CatalogListData {
  const items = dto.data.flatMap((item) => {
    const mapped = mapCatalogCard(item)
    return mapped ? [mapped] : []
  })

  return {
    items,
    filters: mapTenantFilters(dto.meta?.filters),
    total: items.length,
  }
}

export function mapCatalogCard(item: unknown): CatalogCardItem | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const slug = text(record.slug)
  const title = text(record.name)
  if (!slug || !title) return undefined

  const categoryRecord = asRecord(record.category)
  const floorRecord = asRecord(record.floor)
  const category = categoryRecord ? text(categoryRecord.name) : ''
  const categorySlug = categoryRecord ? text(categoryRecord.slug) : ''
  const floor = floorRecord ? text(floorRecord.name) : ''
  const type = text(record.type)
  const to = sitePath(record.url) || (isTenantCatalog(type) ? `/${type}/${slug}` : '')
  const status = mapStatus(record.status)
  const podium = text(record.podium)
  const tags = mapTags(record)

  return {
    id: typeof record.id === 'number' && Number.isFinite(record.id) ? String(record.id) : slug,
    imageSrc: text(record.logo),
    imageAlt: resolveAlt(title),
    category,
    title,
    floor,
    ...(categorySlug ? { categorySlug } : {}),
    ...(status ? { status } : {}),
    ...(podium ? { podium } : {}),
    ...(tags.length ? { tags } : {}),
    ...(record.breakfast === true ? { breakfast: true } : {}),
    ...(to ? { to } : {}),
    mapUrl: `/map?tenant=${encodeURIComponent(slug)}`,
    tenantId: slug,
  }
}

export function mapTenantFilters(filters: unknown): CatalogListData['filters'] {
  const record = asRecord(filters)

  return {
    categories: mapFilterList(record?.categories, mapCategoryChoice),
    floors: mapFilterList(record?.floors, mapFloorChoice),
  }
}

/** Карточка `GET /tenants/{slug}`. `news` — уже сматченная лента `/feed?tenant=`. */
export function mapTenantDetail(
  data: unknown,
  news: readonly NewsCardItem[] = [],
): TenantDetail | undefined {
  const record = asRecord(data)
  if (!record) return undefined

  const slug = text(record.slug)
  const title = text(record.name)
  const catalog = text(record.type)
  if (!slug || !title || !isTenantCatalog(catalog)) return undefined

  const categoryRecord = asRecord(record.category)
  const floorRecord = asRecord(record.floor)
  const phone = text(record.phone)
  const href = phoneHref(phone)
  const website = websiteHref(text(record.website))
  const about = presentAbout(text(record.about))
  const gallery = galleryOf(record)
  const mapUrl = sitePath(record.map_url) || `/map?tenant=${encodeURIComponent(slug)}`

  return {
    slug,
    catalog,
    title,
    category: categoryRecord ? text(categoryRecord.name) : '',
    floor: floorRecord ? text(floorRecord.name) : '',
    logoSrc: text(record.logo),
    logoAlt: resolveAlt(title),
    mapUrl,
    status: mapStatus(record.status) ?? 'none',
    podium: text(record.podium),
    assortment: text(record.assortment) || null,
    workingHours: Array.isArray(record.working_hours) ? record.working_hours : [],
    seo: mapSeo(record.seo),
    ...(phone ? { phone } : {}),
    ...(href ? { phoneHref: href } : {}),
    ...(website ? { website } : {}),
    ...(about ? { about } : {}),
    ...(gallery.length ? { gallery, galleryAlt: resolveAlt(title) } : {}),
    news: [...news],
  }
}

function mapCategoryChoice(item: unknown): CatalogFilterChoice | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const value = text(record.slug)
  const label = text(record.name)
  if (!value || !label) return undefined

  return { value, label, count: countOf(record.count) }
}

function mapFloorChoice(item: unknown): CatalogFilterChoice | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const label = text(record.name)
  if (!label) return undefined

  return { value: label, label, count: countOf(record.count) }
}

function mapFilterList<T>(value: unknown, mapItem: (item: unknown) => T | undefined): T[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    const mapped = mapItem(item)
    return mapped ? [mapped] : []
  })
}

function mapTags(record: Record<string, unknown>): CatalogCardTag[] {
  const raw = Array.isArray(record.tags) ? record.tags : []
  const tags: CatalogCardTag[] = []

  for (const tag of raw) {
    if (typeof tag !== 'string' || !isCardTag(tag) || tags.includes(tag)) continue
    tags.push(tag)
  }

  if (record.business_lunch === true && !tags.includes('lunch')) {
    tags.push('lunch')
  }

  return tags.slice(0, 3)
}

function isCardTag(value: string): value is CatalogCardTag {
  return CARD_TAGS.has(value as CatalogCardTag)
}

function mapStatus(value: unknown): TenantStatus | undefined {
  return typeof value === 'string' && STATUSES.has(value as TenantStatus)
    ? (value as TenantStatus)
    : undefined
}

function mapSeo(value: unknown): TenantSeo | null {
  const record = asRecord(value)
  if (!record) return null

  const seo = {
    title: text(record.title),
    description: text(record.description),
    keywords: text(record.keywords),
    ogImage: text(record.og_image),
  }

  if (!seo.title && !seo.description && !seo.keywords && !seo.ogImage) return null

  return seo
}

function galleryOf(record: Record<string, unknown>): string[] {
  const fromList = Array.isArray(record.gallery)
    ? record.gallery.flatMap((item) => {
        const src = text(item)
        return src ? [src] : []
      })
    : []

  if (fromList.length) return fromList

  const image = text(record.image)
  return image ? [image] : []
}

/** Убирает инлайн-стили CMS и опасные куски, чтобы типографика страницы осталась нашей. */
function presentAbout(html: string): string {
  if (!html) return ''

  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/\s(?:style|class)\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .trim()
}

function phoneHref(phone: string): string {
  if (!phone || /[;,/]/.test(phone)) return ''

  const cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.replace(/\D/g, '').length < 5) return ''

  return `tel:${cleaned}`
}

function websiteHref(value: string): string {
  if (!value || /\s/.test(value) || value.startsWith('//')) return ''
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function countOf(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 0
  return Math.floor(value)
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** В карточку попадает только путь сайта. Внешний URL из CMS не становится ссылкой. */
function sitePath(value: unknown): string {
  const path = text(value)
  if (!path.startsWith('/') || path.startsWith('//')) return ''
  return path
}
