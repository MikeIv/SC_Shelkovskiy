import type { CatalogCardItem } from '#shared/types/catalog'
import { withTenantDetailLinks } from '#shared/utils/tenantPath'

/** Временные данные каталога услуг до контракта API. */
const servicesCatalogBaseItems = [
  {
    id: '1001tur',
    imageSrc: '/images/services/1001tur.png',
    imageAlt: '1001Тур',
    category: 'Туристические услуги',
    title: '1001Тур',
    floor: '1 этаж',
    tags: ['loyalty'],
    tenantId: '1001tur',
  },
  {
    id: 'dom-bita',
    imageSrc: '/images/services/dom-bita.png',
    imageAlt: 'ДОМ БЫТА',
    category: 'Бытовые услуги',
    title: 'ДОМ БЫТА',
    floor: '1 этаж',
    tags: ['action'],
    tenantId: 'dom-bita',
  },
  {
    id: 'reglet',
    imageSrc: '/images/services/reglet.png',
    imageAlt: 'Копи центр Реглет',
    category: 'Фото и копировальные услуги',
    title: 'Копи центр Реглет',
    floor: '1 этаж',
    tags: ['loyalty', 'action'],
    tenantId: 'reglet',
  },
  {
    id: 'edem',
    imageSrc: '/images/services/edem.png',
    imageAlt: 'Эдем',
    category: 'Химчистка',
    title: 'Эдем',
    floor: '1 этаж',
    tenantId: 'edem',
  },
  {
    id: 'mfc',
    imageSrc: '/images/services/mfc.png',
    imageAlt: 'МФЦ «МОИ ДОКУМЕНТЫ»',
    category: 'МФЦ «МОИ ДОКУМЕНТЫ»',
    title: 'МФЦ «МОИ ДОКУМЕНТЫ»',
    floor: '1 этаж',
    tenantId: 'mfc',
  },
  {
    id: 'car-plates',
    imageSrc: '/images/services/car-plates.png',
    imageAlt: 'Изготовление регистрационных знаков для а/м',
    category: 'МФЦ «МОИ ДОКУМЕНТЫ»',
    title: 'Изготовление регистрационных знаков для а/м',
    floor: '1 этаж',
    tenantId: 'car-plates',
  },
  {
    id: 'doktor-stoletov',
    imageSrc: '/images/services/doktor-stoletov.png',
    imageAlt: 'Доктор Столетов',
    category: 'Аптеки',
    title: 'Доктор Столетов',
    floor: '1 этаж',
    tags: ['action'],
    tenantId: 'doktor-stoletov',
  },
  {
    id: 'vtb-atm',
    imageSrc: '/images/services/vtb-atm.png',
    imageAlt: 'Банкомат ВТБ',
    category: 'Банкоматы',
    title: 'Банкомат ВТБ',
    floor: '1 этаж',
    tenantId: 'vtb-atm',
  },
] as const satisfies readonly CatalogCardItem[]

export const servicesCatalogItems: CatalogCardItem[] = withTenantDetailLinks('services', [
  ...servicesCatalogBaseItems,
  ...servicesCatalogBaseItems.map((item, index) => ({
    ...item,
    id: `${item.id}-dup-${index}`,
  })),
])
