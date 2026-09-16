export interface FooterNavItem {
  readonly label: string
  /** Внутренний маршрут. Без страницы — не задавать (пункт без навигации). */
  readonly to?: string
}

export interface FooterSocialLink {
  readonly label: string
  readonly href: string
  /** Имя в коллекции `local` (`UIcon`). */
  readonly icon: `local:${string}`
  /** CSS-цвет глифа по hover. */
  readonly hoverColor?: string
}

export const footerNavPrimary: readonly FooterNavItem[] = [
  { label: 'О нас', to: '/about' },
  { label: 'Новости и акции', to: '/news' },
  { label: 'Галерея', to: '/gallery' },
  { label: 'Социальная активность и награды', to: '/awards' },
  { label: 'Партнерам', to: '/tenants' },
  { label: 'Кабинет арендатора', to: '/login' },
]

export const footerNavSecondary: readonly FooterNavItem[] = [
  { label: 'Парковка', to: '/parking' },
  { label: 'Автовокзал' },
  { label: 'Вакансии', to: '/vacancies' },
  { label: 'Контакты', to: '/contacts' },
  { label: 'Правила', to: '/rules' },
]

export const footerSocialLinks = [
  {
    label: 'Сайт',
    href: 'https://schelkovsky-trc.ru',
    icon: 'local:social-globe',
    hoverColor: 'var(--fs-color-beige)',
  },
  {
    label: 'ВКонтакте',
    href: 'https://vk.com/trc.schelkovsky',
    icon: 'local:social-vk',
    hoverColor: '#0077ff',
  },
  {
    label: 'Telegram',
    href: 'https://t.me/schelkovsky',
    icon: 'local:social-telegram',
    hoverColor: '#2aabee',
  },
  {
    label: 'Rutube',
    href: 'https://rutube.ru',
    icon: 'local:social-rutube',
    hoverColor: 'var(--fs-color-coral)',
  },
] as const satisfies readonly FooterSocialLink[]

export const footerContacts: {
  readonly phone: string
  readonly phoneHref: string
  readonly email: string
  readonly emailHref: string
  readonly address: string
  readonly copyright: string
  readonly privacyLabel: string
  readonly privacyHref?: string
} = {
  phone: '+7 (499) 677-44-44',
  phoneHref: 'tel:+74996774444',
  email: 'info@schelkovsky-trc.ru',
  emailHref: 'mailto:info@schelkovsky-trc.ru',
  address: '107207 Москва, Щёлковское шоссе, 75',
  copyright: 'ТРЦ «Щёлковский» © 2026',
  privacyLabel: 'Политика обработки персональных данных',
  privacyHref: '/rules',
}
