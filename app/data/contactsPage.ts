import type {
  ContactsDepartment,
  ContactsFeedbackContent,
  ContactsPageContent,
} from '#shared/types/contacts'
import type { PageData } from '#shared/types/page'
import { footerContacts } from '~/utils/siteFooter'

/** Мок страницы «Контакты», пока `/pages/contacts` или поля layout пусты. */
export const contactsPage = {
  title: 'Контакты',
  address: 'Москва, Щёлковское шоссе, 75',
  metroLabel: 'Щёлковская',
  metroIconSrc: '/images/contacts/metro-m.svg',
  phone: footerContacts.phone,
  phoneHref: footerContacts.phoneHref,
  email: footerContacts.email,
  emailHref: footerContacts.emailHref,
  mapSrc: '/images/contacts/map.webp',
  mapAlt: 'Карта проезда к ТРЦ «Щёлковский»',
  mapPlace: null,
  helpTitle: 'Нужна помощь?',
  helpText: 'Обратитесь к нам',
  helpCtaLabel: 'Написать нам',
} as const satisfies ContactsPageContent

/**
 * Ответ `/pages/contacts`, когда ручка пуста или недоступна:
 * страница собирается из мока выше, а `form`/`map_route` остаются пустыми.
 */
export const contactsPageApi: PageData = {
  slug: 'contacts',
  title: contactsPage.title,
  seo: null,
  form: null,
  mapRoute: null,
}

export const contactsFeedback = {
  title: 'Остались вопросы?',
  description: 'Заполните форму и наши менеджеры свяжутся с Вами в ближайшее время',
  topics: [
    { value: 'general', label: 'Общий вопрос' },
    { value: 'lease', label: 'Аренда' },
    { value: 'ads', label: 'Реклама' },
    { value: 'press', label: 'Для СМИ' },
  ],
  patternSrc: '/images/contacts/feedback-pattern.svg',
} as const satisfies ContactsFeedbackContent

export const contactsDepartments: ContactsDepartment[] = [
  {
    id: 'lease',
    title: 'Аренда',
    phone: '+7 (499) 677-88-88',
    phoneHref: 'tel:+74996778888',
    phoneExt: '(5151)',
    email: 'arenda@schelkovsky-trc.ru',
    emailHref: 'mailto:arenda@schelkovsky-trc.ru',
  },
  {
    id: 'ads',
    title: 'Реклама',
    phone: '+7 (499) 677-88-88',
    phoneHref: 'tel:+74996778888',
    phoneExt: '(4779)',
    email: 'reklama@schelkovsky-trc.ru',
    emailHref: 'mailto:reklama@schelkovsky-trc.ru',
  },
  {
    id: 'press',
    title: 'Для СМИ',
    phone: '+7 (499) 677-88-88',
    phoneHref: 'tel:+74996778888',
    phoneExt: '(5181)',
    email: 'pr@schelkovsky-trc.ru',
    emailHref: 'mailto:pr@schelkovsky-trc.ru',
  },
]
