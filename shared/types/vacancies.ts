/** Контакты по вакансии. */
export interface VacancyContacts {
  readonly name: string
  readonly phone: string
  readonly phoneHref: string
  readonly email: string
  readonly emailHref: string
}

/** Секция описания вакансии (обязанности / требования / условия). */
export interface VacancySection {
  readonly title: string
  readonly items: readonly string[]
}

/** Карточка вакансии в аккордеоне. */
export interface VacancyItem {
  readonly id: string
  readonly title: string
  readonly contacts?: VacancyContacts
  readonly sections: readonly VacancySection[]
  readonly footnotes?: readonly string[]
}
