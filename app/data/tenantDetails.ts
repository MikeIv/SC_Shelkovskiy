import type { CatalogCardItem } from '#shared/types/catalog'
import type { NewsCardItem } from '#shared/types/news'
import type { TenantCatalog, TenantDetail } from '#shared/types/tenantDetail'
import { normalizeTenantSlug } from '#shared/utils/tenantPath'
import { cafesCatalogItems } from '~/data/cafesCatalogItems'
import { entertainmentCatalogItems } from '~/data/entertainmentCatalogItems'
import { getNewsItemBySlug } from '~/data/newsCatalogItems'
import { servicesCatalogItems } from '~/data/servicesCatalogItems'
import { shopsCatalogItems } from '~/data/shopsCatalogItems'

/** Блок «Новости и акции» — только если у бренда больше двух материалов. */
const TENANT_NEWS_BLOCK_MIN = 3

/**
 * Общий мок страницы арендатора (Figma 528:12233) до контракта API.
 * Идентичность карточки (название, категория, этаж, лого, схема) берётся из каталога.
 */
const tenantPageMock = {
  phone: '+7 (495) 730 10 86',
  phoneHref: 'tel:+74957301086',
  website: 'https://befree.ru/',
  aboutTitle: 'О бренде',
  about: [
    'Befree — бренд для всех, кто любит молодежную моду, независимо от возраста. Свобода самовыражения, красота и уникальность каждого — ценности, которые они продвигают.',
    'Магазин Befree — это минималистичное пространство с элементами разных стилей, комфортной зоной отдыха и мягким светом в примерочных. Здесь есть мужской и женский отделы, обувь, одежда для дома и спорта, белье и аксессуары.',
    'Коллекции обновляются несколько раз в сезон: базовые вещи соседствуют с яркими акцентами, а капсулы позволяют собрать полный образ — от повседневных образов до вечерних выходов.',
    'В магазине работают стилисты, которые помогают подобрать размер и сочетания. Примерочные рассчитаны на комфортную посадку, есть места для ожидания и зарядки гаджетов.',
    'Программа лояльности ТРЦ действует на покупки бренда: баллы начисляются на карту и списываются в счёт следующих заказов. Актуальные акции смотрите в блоке новостей ниже.',
  ],
  gallery: [
    '/images/tenant/befree/gallery-1.jpg',
    '/images/tenant/befree/gallery-2.jpg',
    '/images/tenant/befree/gallery-1.jpg',
    '/images/tenant/befree/gallery-2.jpg',
    '/images/tenant/befree/gallery-1.jpg',
  ],
  newsIds: ['befree-summer', 'befree-sale', 'befree-selected'],
} as const

const catalogItemsBySection: Record<TenantCatalog, CatalogCardItem[]> = {
  shops: shopsCatalogItems,
  cafes: cafesCatalogItems,
  services: servicesCatalogItems,
  entertainment: entertainmentCatalogItems,
}

function findCatalogCard(catalog: TenantCatalog, slug: string): CatalogCardItem | undefined {
  const items = catalogItemsBySection[catalog]

  return (
    items.find((item) => item.id === slug) ??
    items.find((item) => (item.tenantId ?? normalizeTenantSlug(item.id)) === slug)
  )
}

function resolveNews(ids: readonly string[]): NewsCardItem[] {
  return ids
    .map((id) => getNewsItemBySlug(id))
    .filter((item): item is NewsCardItem => Boolean(item))
}

export function getTenantDetailBySlug(
  catalog: TenantCatalog,
  slug: string,
): TenantDetail | undefined {
  const normalized = normalizeTenantSlug(slug)
  const card = findCatalogCard(catalog, normalized)

  if (!card) {
    return undefined
  }

  const tenantId = card.tenantId ?? normalized
  const news = resolveNews(tenantPageMock.newsIds)

  return {
    slug: normalized,
    catalog,
    title: card.title,
    category: card.category,
    floor: card.floor,
    logoSrc: card.imageSrc,
    logoAlt: card.imageAlt,
    mapUrl: `/map?tenant=${encodeURIComponent(tenantId)}`,
    phone: tenantPageMock.phone,
    phoneHref: tenantPageMock.phoneHref,
    website: tenantPageMock.website,
    aboutTitle: tenantPageMock.aboutTitle,
    about: [...tenantPageMock.about],
    gallery: [...tenantPageMock.gallery],
    galleryAlt: card.imageAlt || card.title,
    news: news.length >= TENANT_NEWS_BLOCK_MIN ? news : [],
  }
}
