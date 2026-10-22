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

/**
 * ФИО: минимум две части через пробел, в каждой есть буква,
 * хотя бы в одной — две буквы (инициалы допускаются).
 */
export function isFullName(value: string): boolean {
  const trimmed = value.trim()

  if (!isPersonNameChars(trimmed)) return false

  const parts = trimmed.split(/\s+/).filter(Boolean)
  const letterCounts = parts.map((part) => part.match(/\p{L}/gu)?.length ?? 0)

  if (parts.length < 2) return false
  if (letterCounts.some((count) => count === 0)) return false

  return letterCounts.some((count) => count >= 2)
}

/** Лишние символы отбрасываются, пробелы схлопываются, первая буква становится заглавной. */
export function maskPersonName(value: string): string {
  return value
    .replace(/[^\p{L}\s.'’-]/gu, '')
    .replace(/\s+/gu, ' ')
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

/**
 * Маска российского номера «+7 (999) 123-45-67»: всё, кроме цифр, отбрасывается,
 * ведущие 8/7 считаются кодом страны, номер обрезается до 10 цифр.
 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  const national = (/^[78]/u.test(digits) ? digits.slice(1) : digits).slice(0, 10)

  if (!national) return ''

  const area = national.slice(0, 3)
  const tail = [national.slice(3, 6), national.slice(6, 8), national.slice(8, 10)].filter(Boolean)

  return tail.length > 0 ? `+7 (${area}) ${tail.join('-')}` : `+7 (${area}`
}

const hostLabel = /^[\p{L}\d](?:[\p{L}\d-]*[\p{L}\d])?$/u

/** http(s)-адрес или домен с точкой, без пробелов. */
export function isHttpUrl(value: string): boolean {
  const trimmed = value.trim()

  if (!trimmed || /\s/u.test(trimmed)) return false

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(withProtocol)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    if (url.username || url.password) return false

    const labels = url.hostname.split('.')

    if (labels.length < 2) return false
    if (!/\p{L}/u.test(url.hostname)) return false

    return labels.every((label) => hostLabel.test(label))
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
