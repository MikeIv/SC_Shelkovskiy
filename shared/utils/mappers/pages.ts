import type { PageResponseDto } from '#shared/types/dto/pages'
import type { PageData, PageDocument, PageFormBlock, PageMapRoute } from '#shared/types/page'
import { asRecord, text } from '#shared/utils/apiRecord'
import { mapApiSeo } from '#shared/utils/mapApiSeo'

const FORM_KINDS = ['lease', 'ads', 'feedback'] as const

/** `GET /pages/{slug}` → UI: title, seo, form, map_route и документы. */
export function mapPage(dto: PageResponseDto): PageData {
  const { slug, title, blocks, seo } = dto.data

  let form: PageFormBlock | null = null
  let mapRoute: PageMapRoute | null = null

  for (const item of blocks) {
    if (!form) form = mapFormBlock(item)
    if (!mapRoute) mapRoute = mapMapRoute(item)
    if (form && mapRoute) break
  }

  return {
    slug: text(slug),
    title: text(title),
    seo: mapApiSeo(seo),
    form,
    mapRoute,
    documents: mapDocuments(blocks),
  }
}

function mapFormBlock(item: unknown): PageFormBlock | null {
  const record = asRecord(item)
  if (!record || text(record.type) !== 'form') return null

  const data = asRecord(record.data)
  if (!data) return null

  const kind = text(data.kind)
  if (!isFormKind(kind)) return null

  return {
    kind,
    title: text(data.title),
    description: text(data.description),
  }
}

function mapMapRoute(item: unknown): PageMapRoute | null {
  const record = asRecord(item)
  if (!record || text(record.type) !== 'map_route') return null

  const data = asRecord(record.data)
  if (!data) return null

  const address = text(data.address)
  const coordinates = mapCoordinates(data.coordinates)
  if (!address || !coordinates) return null

  return { address, coordinates }
}

/** Пара чисел `[lng, lat]`; строки с `,` как десятичным разделителем тоже принимаем. */
function mapCoordinates(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length < 2) return null

  const lng = asCoord(value[0])
  const lat = asCoord(value[1])
  if (lng == null || lat == null) return null

  return [lng, lat]
}

function asCoord(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return null
  /** Пустое поле админки — не координата: `Number('')` вернул бы 0. */
  if (value.trim() === '') return null

  const parsed = Number(value.trim().replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

function isFormKind(value: string): value is PageFormBlock['kind'] {
  return (FORM_KINDS as readonly string[]).includes(value)
}

/** Блоки `documents` в порядке вывода. Ссылки из `text` не подмешиваем. */
function mapDocuments(blocks: readonly unknown[]): PageDocument[] {
  const documents: PageDocument[] = []

  for (const item of blocks) {
    const record = asRecord(item)
    if (!record || text(record.type) !== 'documents') continue

    const data = asRecord(record.data)
    if (!data) continue

    documents.push(...mapDocumentItems(data.items))
  }

  return documents
}

function mapDocumentItems(value: unknown): PageDocument[] {
  if (!Array.isArray(value)) return []

  const items: PageDocument[] = []
  for (const item of value) {
    const record = asRecord(item)
    if (!record) continue

    const title = text(record.title)
    const url = fileUrl(record.url)
    if (!title || !url) continue

    items.push({ title, url })
  }

  return items
}

function fileUrl(value: unknown): string {
  const url = text(value)
  if (!url || url === '#') return ''
  if (url.startsWith('/') && !url.startsWith('//')) return url
  if (url.startsWith('https://') || url.startsWith('http://')) return url
  return ''
}
