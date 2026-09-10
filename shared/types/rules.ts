/** Документ на странице «Правила». */
export interface RulesDocument {
  readonly id: string
  readonly title: string
  /** Ссылка на файл. Заглушка «#» до появления документов. */
  readonly href: string
}
