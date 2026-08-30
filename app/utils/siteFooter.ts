import socialGlobe from '~/assets/icons/social/social-globe.svg'
import socialMessage from '~/assets/icons/social/social-message.svg'
import socialRutube from '~/assets/icons/social/social-rutube.svg'
import socialTelegram from '~/assets/icons/social/social-telegram.svg'
import socialVk from '~/assets/icons/social/social-vk.svg'

export interface FooterNavItem {
  readonly label: string
  readonly to: string
}

export interface FooterSocialLink {
  readonly label: string
  readonly href: string
  readonly icon: string
}

export const footerNavPrimary = [
  { label: 'О нас', to: '/about' },
  { label: 'Новости и акции', to: '/news' },
  { label: 'Галерея', to: '/gallery' },
  { label: 'Социальная активность и награды', to: '/social' },
  { label: 'Партнерам', to: '/partners' },
  { label: 'Кабинет арендатора', to: '/tenant' },
] as const satisfies readonly FooterNavItem[]

export const footerNavSecondary = [
  { label: 'Парковка', to: '/parking' },
  { label: 'Автовокзал', to: '/bus-station' },
  { label: 'Вакансии', to: '/vacancies' },
  { label: 'Контакты', to: '/contacts' },
  { label: 'Правила', to: '/rules' },
] as const satisfies readonly FooterNavItem[]

export const footerSocialLinks = [
  { label: 'Сайт', href: 'https://schelkovsky-trc.ru', icon: socialGlobe },
  { label: 'ВКонтакте', href: 'https://vk.com', icon: socialVk },
  { label: 'Telegram', href: 'https://t.me', icon: socialTelegram },
  { label: 'Rutube', href: 'https://rutube.ru', icon: socialRutube },
  { label: 'Чат', href: '#', icon: socialMessage },
] as const satisfies readonly FooterSocialLink[]

export const footerContacts = {
  phone: '+7 (499) 677-44-44',
  phoneHref: 'tel:+74996774444',
  email: 'info@schelkovsky-trc.ru',
  emailHref: 'mailto:info@schelkovsky-trc.ru',
  address: '107207 Москва, Щёлковское шоссе, 75',
  copyright: 'ТРЦ «Щёлковский» © 2026',
  privacyLabel: 'Политика обработки персональных данных',
  privacyHref: '/privacy',
} as const
