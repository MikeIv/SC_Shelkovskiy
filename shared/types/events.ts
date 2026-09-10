export type EventAfishaDate = {
  day: string
  month: string
}

export type EventAfishaItem = {
  id: string
  imageSrc: string
  imageAlt: string
  dateStart: EventAfishaDate
  dateEnd?: EventAfishaDate
  tagLabel: string
  title: string
  description: string
  /** Детальная страница; если не задан — строится из `id`. */
  to?: string
}

export type EventProgramItem = {
  time: string
  title: string
}

export type EventRegisterPopup = {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}

export type EventDetailItem = EventAfishaItem & {
  /** Дата публикации на детали. */
  publishedAt?: string
  when: string
  location?: string
  paragraphs: string[]
  program?: EventProgramItem[]
  register?: boolean
}
