import type { VacancyContacts, VacancyItem, VacancySection } from '#shared/types/vacancies'
import { asRecord, text } from '#shared/utils/apiRecord'

/**
 * `GET /vacancies` → карточки аккордеона: `slug` становится ключом списка,
 * а `contacts`/`sections` из админки подчищаются до UI-типов.
 */
export function mapVacancies(items: readonly unknown[]): VacancyItem[] {
  const result: VacancyItem[] = []

  for (const item of items) {
    const record = asRecord(item)
    if (!record) continue

    const id = text(record.slug)
    const title = text(record.title)
    if (!id || !title) continue

    const contacts = mapContacts(record.contacts)

    result.push({
      id,
      title,
      ...(contacts ? { contacts } : {}),
      sections: mapSections(record.sections),
    })
  }

  return result
}

/** Пустые поля админки приходят как `null`: карточка без значений не выводится. */
function mapContacts(value: unknown): VacancyContacts | undefined {
  const record = asRecord(value)
  if (!record) return undefined

  const name = text(record.name)
  const phone = text(record.phone)
  const email = text(record.email)

  if (!name && !phone && !email) return undefined

  return {
    name,
    phone,
    phoneHref: phone ? telHref(phone) : '',
    email,
    emailHref: email ? `mailto:${email}` : '',
  }
}

/** `tel:` без пробелов, скобок и дефисов: номер в админке пишут как удобно. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/** Секция без заголовка или без пунктов не рисуется: в аккордеоне она выглядит поломкой. */
function mapSections(value: unknown): VacancySection[] {
  if (!Array.isArray(value)) return []

  const sections: VacancySection[] = []

  for (const item of value) {
    const record = asRecord(item)
    if (!record) continue

    const title = text(record.title)
    const bullets = mapBullets(record.items)
    if (!title || !bullets.length) continue

    sections.push({ title, items: bullets })
  }

  return sections
}

function mapBullets(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((bullet) => {
    const line = text(bullet)
    return line ? [line] : []
  })
}
