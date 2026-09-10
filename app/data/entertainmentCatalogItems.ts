import type { CatalogCardItem } from '#shared/types/catalog'
import { withTenantDetailLinks } from '#shared/utils/tenantPath'

/** Временные данные каталога спорта и развлечений до контракта API. */
const entertainmentCatalogBaseItems = [
  {
    id: 'joki-joya',
    imageSrc: '/images/entertainment/joki-joya.png',
    imageAlt: 'JOKI JOYA',
    category: 'Развлечения',
    title: 'JOKI JOYA',
    floor: '1 этаж',
    tags: ['loyalty'],
    tenantId: 'joki-joya',
  },
  {
    id: 'world-class',
    imageSrc: '/images/entertainment/world-class.png',
    imageAlt: 'World Class',
    category: 'Спорт',
    title: 'World Class',
    floor: '1 этаж',
    tags: ['action'],
    tenantId: 'world-class',
  },
  {
    id: 'kino-okko',
    imageSrc: '/images/entertainment/kino-okko.png',
    imageAlt: 'КИНО ОККО',
    category: 'Развлечения',
    title: 'КИНО ОККО',
    floor: '1 этаж',
    tenantId: 'kino-okko',
  },
  {
    id: 'kids-train',
    imageSrc: '/images/entertainment/kids-train.png',
    imageAlt: 'Детский паровозик',
    category: 'Развлечения',
    title: 'Детский паровозик',
    floor: '1 этаж',
    tenantId: 'kids-train',
  },
  {
    id: 'tir-prizovoy',
    imageSrc: '/images/entertainment/tir-prizovoy.png',
    imageAlt: 'ТИР ПРИЗОВОЙ',
    category: 'Развлечения',
    title: 'ТИР ПРИЗОВОЙ',
    floor: '1 этаж',
    tenantId: 'tir-prizovoy',
  },
  {
    id: 'more-zhelaniy',
    imageSrc: '/images/entertainment/more-zhelaniy.png',
    imageAlt: 'Море желаний',
    category: 'Развлечения',
    title: 'Море желаний',
    floor: '1 этаж',
    tenantId: 'more-zhelaniy',
  },
  {
    id: 'colizeum',
    imageSrc: '/images/entertainment/colizeum.png',
    imageAlt: 'COLIZEUM',
    category: 'Спорт',
    title: 'COLIZEUM',
    floor: '1 этаж',
    tags: ['action'],
    tenantId: 'colizeum',
  },
  {
    id: 'photobooth',
    imageSrc: '/images/entertainment/photobooth.png',
    imageAlt: 'Фотобудка',
    category: 'Развлечения',
    title: 'Фотобудка',
    floor: '1 этаж',
    tenantId: 'photobooth',
  },
] as const satisfies readonly CatalogCardItem[]

export const entertainmentCatalogItems: CatalogCardItem[] = withTenantDetailLinks('entertainment', [
  ...entertainmentCatalogBaseItems,
  ...entertainmentCatalogBaseItems.map((item, index) => ({
    ...item,
    id: `${item.id}-dup-${index}`,
  })),
])
