import type { CatalogCardItem, CatalogListGroup } from '#shared/types/catalog'

export const CATALOG_LIST_LATIN_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
] as const

export const CATALOG_LIST_CYRILLIC_LETTERS = [
  'А',
  'Б',
  'В',
  'Г',
  'Д',
  'Е',
  'Ё',
  'Ж',
  'З',
  'И',
  'Й',
  'К',
  'Л',
  'М',
  'Н',
  'О',
  'П',
  'Р',
  'С',
  'Т',
  'У',
  'Ф',
  'Х',
  'Ц',
  'Ч',
  'Ш',
  'Щ',
  'Э',
  'Ю',
  'Я',
] as const

export const CATALOG_LIST_DIGIT_GROUP = '0-9' as const

const GROUP_ORDER = new Map<string, number>([
  [CATALOG_LIST_DIGIT_GROUP, 0],
  ...CATALOG_LIST_LATIN_LETTERS.map((letter, index) => [letter, index + 1] as const),
  ...CATALOG_LIST_CYRILLIC_LETTERS.map((letter, index) => [letter, index + 100] as const),
])

export function getCatalogListLetter(title: string): string {
  const trimmed = title.trim()

  if (!trimmed) {
    return CATALOG_LIST_DIGIT_GROUP
  }

  const char = trimmed[0]!.toUpperCase()

  if (/\d/.test(char)) {
    return CATALOG_LIST_DIGIT_GROUP
  }

  if (/[A-Z]/.test(char)) {
    return char
  }

  if (/[А-ЯЁ]/.test(char)) {
    return char
  }

  return CATALOG_LIST_DIGIT_GROUP
}

export function catalogListSectionId(letter: string): string {
  return `catalog-letter-${letter}`
}

function dedupeCatalogListItems(items: CatalogCardItem[]): CatalogCardItem[] {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = item.title.trim().toLowerCase()

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function compareCatalogListGroups(a: CatalogListGroup, b: CatalogListGroup): number {
  return (
    (GROUP_ORDER.get(a.letter) ?? Number.MAX_SAFE_INTEGER) -
    (GROUP_ORDER.get(b.letter) ?? Number.MAX_SAFE_INTEGER)
  )
}

export function groupCatalogListItems(items: CatalogCardItem[]): CatalogListGroup[] {
  const groups = new Map<string, CatalogCardItem[]>()

  for (const item of dedupeCatalogListItems(items)) {
    const letter = getCatalogListLetter(item.title)
    const bucket = groups.get(letter) ?? []
    bucket.push(item)
    groups.set(letter, bucket)
  }

  return [...groups.entries()]
    .map(([letter, groupItems]) => ({
      letter,
      items: groupItems.sort((a, b) => a.title.localeCompare(b.title, 'ru')),
    }))
    .sort(compareCatalogListGroups)
}
