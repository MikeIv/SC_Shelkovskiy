import type { CatalogCardItem } from '#shared/types/catalog'
import { withTenantDetailLinks } from '#shared/utils/tenantPath'

/** Временные данные каталога магазинов до контракта API. */
const shopsCatalogBaseItems = [
  {
    id: 'zolotoy',
    imageSrc: '/images/home/brands/zolotoy.png',
    imageAlt: '585*Золотой',
    category: 'Ювелирные изделия и часы',
    title: '585*Золотой',
    floor: '1 этаж',
    tags: ['loyalty', 'action'],
    tenantId: 'zolotoy',
  },
  {
    id: 'acoola',
    imageSrc: '/images/home/brands/acoola.png',
    imageAlt: 'Acoola',
    category: 'Детская и молодежная мода',
    title: 'Acoola',
    floor: '1 этаж',
    tags: ['loyalty'],
    tenantId: 'acoola',
  },
  {
    id: 'adamas',
    imageSrc: '/images/home/brands/adamas.png',
    imageAlt: 'ADAMAS',
    category: 'Ювелирные изделия и часы',
    title: 'ADAMAS',
    floor: '1 этаж',
    tags: ['loyalty', 'action'],
    tenantId: 'adamas',
  },
  {
    id: 'anta-sports',
    imageSrc: '/images/shops/anta-sports.png',
    imageAlt: 'ANTA SPORTS',
    category: 'Спорт и активный отдых',
    title: 'ANTA SPORTS',
    floor: '1 этаж',
    tenantId: 'anta-sports',
  },
  {
    id: 'arya-home',
    imageSrc: '/images/home/brands/arya-home.png',
    imageAlt: 'ARYA home',
    category: 'Товары для дома',
    title: 'ARYA home',
    floor: '1 этаж',
    tags: ['action'],
    tenantId: 'arya-home',
  },
  {
    id: 'befree',
    imageSrc: '/images/home/brands/befree.png',
    imageAlt: 'Befree',
    category: 'Одежда',
    title: 'Befree',
    floor: '2 этаж',
    tags: ['loyalty', 'action'],
    tenantId: 'befree',
  },
  {
    id: 'balabala',
    imageSrc: '/images/shops/balabala.png',
    imageAlt: 'Balabala',
    category: 'Детская и молодежная мода',
    title: 'Balabala',
    floor: '1 этаж',
    tenantId: 'balabala',
  },
  {
    id: 'ballansiko',
    imageSrc: '/images/shops/ballansiko.png',
    imageAlt: 'BALLANSIKO',
    category: 'Женская одежда',
    title: 'BALLANSIKO',
    floor: '1 этаж',
    tenantId: 'ballansiko',
  },
] as const satisfies readonly CatalogCardItem[]

export const shopsCatalogItems: CatalogCardItem[] = withTenantDetailLinks('shops', [
  ...shopsCatalogBaseItems,
  ...shopsCatalogBaseItems.map((item, index) => ({
    ...item,
    id: `${item.id}-dup-${index}`,
  })),
])
