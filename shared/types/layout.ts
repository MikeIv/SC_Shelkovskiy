import type { ContactsDepartment } from '#shared/types/contacts'

/** День панели часов. `index`: Пн = 0 … Вс = 6, как у мока `mallOpenHours`. */
export type LayoutDayHours = {
  index: number
  label: string
  open: string
  close: string
}

/** Особая дата важнее обычной недели. `open`/`close` пустые, если день закрыт. */
export type LayoutHourException = {
  date: string
  open: string
  close: string
  closed: boolean
}

export type LayoutHoursRange = {
  label: string
  open: string
  close: string
}

export type LayoutHoursTenant = {
  name: string
  ranges: LayoutHoursRange[]
}

export type LayoutHours = {
  timezone: string
  week: LayoutDayHours[]
  exceptions: LayoutHourException[]
  tenants: LayoutHoursTenant[]
}

export type LayoutContacts = {
  address: string
  metro: string
  phone: string
  phoneHref: string
  email: string
  emailHref: string
  departments: ContactsDepartment[]
}

export type LayoutSocial = {
  label: string
  href: string
  /** Иконка коллекции `local`, если сеть нам известна. */
  icon: `local:${string}` | null
  /** Иконка с бэкенда, если локальной нет. */
  iconSrc: string | null
  hoverColor?: string
}

export type LayoutAppLink = {
  id: 'app-store' | 'google-play' | 'rustore'
  label: string
  href: string
}

export type LayoutCtaMax = {
  url: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
}

export type LayoutData = {
  contacts: LayoutContacts
  hours: LayoutHours
  socials: LayoutSocial[]
  apps: LayoutAppLink[]
  ctaMax: LayoutCtaMax | null
}
