import type { PageResponseDto } from '#shared/types/dto/pages'
import type { PageData, PageFormBlock, PageMapRoute } from '#shared/types/page'
import { asRecord, text } from '#shared/utils/apiRecord'
import { mapApiSeo } from '#shared/utils/mapApiSeo'

const FORM_KINDS = ['lease', 'ads', 'feedback'] as const

/** `GET /pages/{slug}` → UI: title, seo, form и map_route. */
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

  const parsed = Number(value.trim().replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

function isFormKind(value: string): value is PageFormBlock['kind'] {
  return (FORM_KINDS as readonly string[]).includes(value)
}
