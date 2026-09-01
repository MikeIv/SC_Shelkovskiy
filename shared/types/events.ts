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
  to?: string
}
