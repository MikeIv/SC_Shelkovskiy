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

export type SiteNavPath = (typeof siteNavItems)[number]['to']

export function getSiteNavItem(path: SiteNavPath) {
  const item = siteNavItems.find((nav) => nav.to === path)

  if (!item) {
    throw new Error(`Unknown site nav path: ${path}`)
  }

  return item
}
