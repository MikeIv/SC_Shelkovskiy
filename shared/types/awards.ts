import type { ApiSeo } from '#shared/types/seo'

/** Карточка социальной активности / награды. Пустые `date` и `dateIso` — даты в API не было. */
export interface AwardsItem {
  readonly id: string
  readonly date: string
  readonly dateIso: string
  readonly title: string
}

/** Детальная `GET /awards/{slug}` и блок связанных карточек. */
export interface AwardsDetailData {
  readonly item: AwardsDetailItem
  readonly related: readonly AwardsItem[]
}

/** Детальная страница награды / социальной активности. */
export interface AwardsDetailItem extends AwardsItem {
  readonly subtitle: string
  /** Абзацы демо-мока. У ответа API пустой список: текст лежит в `bodyHtml`. */
  readonly paragraphs: readonly string[]
  /** HTML из CMS после `sanitizeApiHtml`. Пустая строка — текста нет. */
  readonly bodyHtml: string
  readonly imageSrc: string
  readonly imageAlt: string
  readonly seo: ApiSeo | null
}
