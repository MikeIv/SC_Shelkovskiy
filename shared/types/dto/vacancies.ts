/**
 * `GET /vacancies` — все открытые вакансии без пагинации.
 * Текст разбит на `sections` (`title`, `items[]`), поля `contacts` могут быть `null`.
 */
export type VacancyContactsDto = {
  name: string | null
  phone: string | null
  email: string | null
}

/** Секция описания: «Обязанности», «Требования», «Условия». */
export type VacancySectionDto = {
  title: string
  items: string[]
}

export type VacancyDto = {
  slug: string
  title: string
  contacts?: VacancyContactsDto | null
  sections?: VacancySectionDto[]
}

export type VacanciesResponseDto = {
  data: VacancyDto[]
}
