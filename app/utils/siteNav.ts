export interface SiteNavItem {
  readonly label: string
  readonly to: string
}

export interface MenuNavPrimaryItem extends SiteNavItem {
  /** Круглое фото в desktop-меню (UI-kit Menu animation). */
  readonly imageSrc: string
}

export const siteNavItems = [
  { label: 'Магазины', to: '/shops', imageSrc: '/images/layout/menu/shops.jpg' },
  { label: 'Кафе и рестораны', to: '/cafes', imageSrc: '/images/layout/menu/cafes.jpg' },
  { label: 'Услуги', to: '/services', imageSrc: '/images/layout/menu/services.jpg' },
  {
    label: 'Спорт и развлечения',
    to: '/entertainment',
    imageSrc: '/images/layout/menu/entertainment.jpg',
  },
  { label: 'Новости и акции', to: '/news', imageSrc: '/images/layout/menu/news.jpg' },
  { label: 'Мероприятия', to: '/events', imageSrc: '/images/layout/menu/events.jpg' },
] as const satisfies readonly MenuNavPrimaryItem[]

/** Дефолтный кадр меню до hover (и после mouseleave). */
export const menuMediaDefaultSrc = '/images/layout/menu-mall.jpg'

export const menuNavSecondary = [
  { label: 'О нас', to: '/about' },
  { label: 'Галерея', to: '/gallery' },
  { label: 'Парковка', to: '/parking' },
  { label: 'Программа лояльности', to: '/loyalty' },
  { label: 'Подарочные карты', to: '/gift-cards' },
  { label: 'Арендаторам', to: '/tenants' },
] as const satisfies readonly SiteNavItem[]

export type SiteNavPath = (typeof siteNavItems)[number]['to']

/** Полоска hover/active пунктов хедера (Figma 3149:37767, 3149:37937). */
export const siteNavUnderline = {
  '/shops': 'var(--fs-color-pink)',
  '/cafes': 'var(--fs-color-green)',
  '/services': 'var(--fs-color-orange)',
  '/entertainment': 'var(--fs-color-cyan)',
  '/news': 'var(--fs-color-coral)',
  '/events': 'var(--fs-color-blue)',
} as const satisfies Record<SiteNavPath, string>

export function getSiteNavItem(path: SiteNavPath) {
  const item = siteNavItems.find((nav) => nav.to === path)

  if (!item) {
    throw new Error(`Unknown site nav path: ${path}`)
  }

  return item
}
