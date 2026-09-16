export interface SiteNavItem {
  readonly label: string
  readonly to: string
}

export const siteNavItems = [
  { label: 'Магазины', to: '/shops' },
  { label: 'Кафе и рестораны', to: '/cafes' },
  { label: 'Услуги', to: '/services' },
  { label: 'Спорт и развлечения', to: '/entertainment' },
  { label: 'Новости и акции', to: '/news' },
  { label: 'Мероприятия', to: '/events' },
] as const satisfies readonly SiteNavItem[]

export const menuNavSecondary = [
  { label: 'О нас', to: '/about' },
  { label: 'Галерея', to: '/gallery' },
  { label: 'Парковка', to: '/parking' },
  { label: 'Программа лояльности', to: '/loyalty' },
  { label: 'Подарочные карты', to: '/gift-cards' },
  { label: 'Арендаторам', to: '/tenants' },
] as const satisfies readonly SiteNavItem[]

export type SiteNavPath = (typeof siteNavItems)[number]['to']

/** Полоска hover/active пунктов хедера (UI-kit 94:12103…94:12279). */
export const siteNavUnderline = {
  '/shops': 'var(--fs-color-wheat)',
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
