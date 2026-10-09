import type { FeedListResponseDto } from '#shared/types/dto/feed'
import type { NewsDetailItem, NewsDetailTenant, NewsListData } from '#shared/types/news'
import { asRecord, sitePath, text } from '#shared/utils/apiRecord'
import { formatApiDate } from '#shared/utils/formatApiDate'
import { formatApiPeriodRange, formatApiPeriodUntil } from '#shared/utils/formatApiPeriod'
import { mapApiListMeta } from '#shared/utils/mapApiListMeta'
import { mapApiSeo } from '#shared/utils/mapApiSeo'
import { mapFeedItem, mapHomeFeed } from '#shared/utils/mappers/home'
import { resolveAlt } from '#shared/utils/resolveAlt'
import { sanitizeApiHtml } from '#shared/utils/sanitizeApiHtml'

/** Страница ленты: те же карточки, что на главной, плюс `meta` для «показать ещё». */
export function mapFeedList(dto: FeedListResponseDto): NewsListData {
  return {
    items: mapHomeFeed(dto.data),
    meta: mapApiListMeta(dto.meta),
  }
}

/**
 * Детальная `GET /feed/{slug}`: карточка из `mapFeedItem` + HTML `text`, галерея,
 * арендатор (`source.kind: tenant`) и `seo`. Неизвестные поля отбрасываются.
 */
export function mapNewsDetail(data: unknown): NewsDetailItem | undefined {
  const record = asRecord(data)
  if (!record) return undefined

  const card = mapFeedItem(record)
  if (!card) return undefined

  const publishedAtIso = text(record.published_at)
  const publishedAt = formatApiDate(publishedAtIso, { withYear: true })
  const period = mapPeriod(record.period)
  const gallery = galleryOf(record, card.imageSrc)
  const tenant = mapTenant(record.tenant)
  const bodyHtml = sanitizeApiHtml(text(record.text))

  return {
    ...card,
    ...(publishedAt ? { publishedAt, publishedAtIso } : {}),
    ...(period ? { period } : {}),
    ...(gallery.length ? { gallery } : {}),
    ...(tenant ? { tenant } : {}),
    ...(bodyHtml ? { bodyHtml } : {}),
    seo: mapApiSeo(record.seo),
  }
}

/** Срок акции: «1 октября — 31 октября», один день — «1 октября», только конец — «до 31 октября». */
function mapPeriod(value: unknown): string {
  const record = asRecord(value)
  if (!record) return ''

  const from = text(record.from)
  const to = text(record.to)

  if (from && to) {
    return from === to ? formatApiDate(to) : formatApiPeriodRange(from, to)
  }

  if (to) return formatApiPeriodUntil(to)

  return formatApiDate(from)
}

function galleryOf(record: Record<string, unknown>, imageSrc: string): string[] {
  const fromList = Array.isArray(record.gallery)
    ? record.gallery.flatMap((item) => {
        const src = text(item)
        return src ? [src] : []
      })
    : []

  if (fromList.length) return fromList

  return imageSrc ? [imageSrc] : []
}

function mapTenant(value: unknown): NewsDetailTenant | undefined {
  const record = asRecord(value)
  if (!record) return undefined

  const name = text(record.name)
  const slug = text(record.slug)
  const logoSrc = text(record.logo)
  const floor = text(record.floor)
  const mapUrl = sitePath(record.map_url) || (slug ? `/map?tenant=${encodeURIComponent(slug)}` : '')

  if (!name && !logoSrc && !floor && !mapUrl) return undefined

  return {
    ...(logoSrc ? { logoSrc } : {}),
    ...(name ? { logoAlt: resolveAlt(name) } : {}),
    ...(floor ? { floor } : {}),
    ...(mapUrl ? { mapUrl } : {}),
  }
}
