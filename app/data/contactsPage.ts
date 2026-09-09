import type {
  ContactsDepartment,
  ContactsHoursRange,
  ContactsPageContent,
} from '#shared/types/contacts'
import { footerContacts } from '~/utils/siteFooter'

/** Временные данные до контракта API. */
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
  helpTitle: 'Нужна помощь?',
  helpText: 'Обратитесь к нам',
  helpCtaLabel: 'Написать нам',
  helpCtaHref: footerContacts.emailHref,
} as const satisfies ContactsPageContent

export const contactsHours: ContactsHoursRange[] = [
  {
    id: 'weekdays-sun',
    days: 'ПН-ЧТ, ВС',
    time: '10:00 - 22:00',
  },
  {
    id: 'fri-sat',
    days: 'ПТ-СБ',
    time: '10:00 - 23:00',
  },
]

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
