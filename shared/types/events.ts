import type { ApiListMeta } from '#shared/types/api'
import type { ApiSeo } from '#shared/types/seo'

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
  /** Та же дата в ISO — для `<time datetime>`, роботов и скринридеров. */
  publishedAtIso?: string
  when: string
  location?: string
  paragraphs: string[]
  program?: EventProgramItem[]
  register?: boolean
  /**
   * Текст мероприятия из API — HTML из CMS, очищенный маппером.
   * Мок отдаёт `paragraphs`, поэтому в UI два варианта вывода.
   */
  bodyHtml?: string
  seo?: ApiSeo | null
}

/** Ответ прокси `/api/events`: афиша и пагинация Laravel. */
export type EventsListData = {
  items: EventAfishaItem[]
  meta: ApiListMeta | null
}
