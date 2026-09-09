/** Карточка социальной активности / награды. */
export interface AwardsItem {
  readonly id: string
  readonly date: string
  readonly dateIso: string
  readonly title: string
}

/** Детальная страница награды / социальной активности. */
export interface AwardsDetailItem extends AwardsItem {
  readonly subtitle: string
  readonly paragraphs: readonly string[]
  readonly imageSrc: string
  readonly imageAlt: string
}
