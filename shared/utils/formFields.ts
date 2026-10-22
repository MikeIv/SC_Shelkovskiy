const personNameChars = /^[\p{L}\s.'’-]*$/u

/** Буквы, пробелы, дефис и апостроф — без цифр. */
export function isPersonNameChars(value: string): boolean {
  return personNameChars.test(value)
}

/** Непустая строка из букв: хотя бы одна буква, без цифр. */
export function isPersonName(value: string): boolean {
  const trimmed = value.trim()

  return trimmed.length > 0 && isPersonNameChars(trimmed) && /\p{L}/u.test(trimmed)
}

/** ФИО: минимум две части через пробел, в каждой не меньше двух букв. */
export function isFullName(value: string): boolean {
  const trimmed = value.trim()

  if (!isPersonNameChars(trimmed)) return false

  const parts = trimmed.split(/\s+/).filter(Boolean)

  return parts.length >= 2 && parts.every((part) => (part.match(/\p{L}/gu)?.length ?? 0) >= 2)
}

/** Цифры отбрасываются, первая буква становится заглавной. */
export function maskPersonName(value: string): string {
  return value
    .replace(/\p{Nd}/gu, '')
    .replace(/^\p{L}/u, (letter) => letter.toLocaleUpperCase('ru-RU'))
}

const phoneChars = /^\+?[\d\s()-]*$/

/** Цифры, пробел, скобки, дефис и один «+» в начале. */
export function isPhoneChars(value: string): boolean {
  return phoneChars.test(value)
}

/**
 * Телефон РФ: 10 цифр или 11 с ведущими 7/8.
 * Буквы не принимаются.
 */
export function isPhone(value: string): boolean {
  const trimmed = value.trim()

  if (!trimmed || !isPhoneChars(trimmed)) return false

  const digits = trimmed.replace(/\D/g, '')

  if (digits.length === 10) return true

  return digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))
}

/** http(s)-адрес или домен с точкой, без пробелов. */
export function isHttpUrl(value: string): boolean {
  const trimmed = value.trim()

  if (!trimmed || /\s/u.test(trimmed)) return false

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(withProtocol)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    if (url.username || url.password) return false

    const host = url.hostname

    return host.includes('.') && /\p{L}/u.test(host) && /^[\p{L}\d.-]+$/u.test(host)
  } catch {
    return false
  }
}

const intChars = /^\d*$/
const intValue = /^(?:0|[1-9]\d*)$/

export function isNonNegativeIntChars(value: string): boolean {
  return intChars.test(value)
}

/** Целое число ≥ 0 без ведущих нулей, кроме самого нуля. */
export function isNonNegativeInt(value: string): boolean {
  return intValue.test(value.trim())
}

const amountChars = /^\d*(?:[.,]\d*)?$/
const amountValue = /^\d+(?:[.,]\d+)?$/

export function isPositiveAmountChars(value: string): boolean {
  return amountChars.test(value)
}

/** Положительное число; разделитель — точка или запятая. */
export function isPositiveAmount(value: string): boolean {
  const trimmed = value.trim()

  if (!amountValue.test(trimmed)) return false

  const amount = Number(trimmed.replace(',', '.'))

  return Number.isFinite(amount) && amount > 0
}

export function parsePositiveAmount(value: string): number | null {
  if (!isPositiveAmount(value)) return null

  return Number(value.trim().replace(',', '.'))
}
