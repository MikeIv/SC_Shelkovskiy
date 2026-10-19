import type { HomeGalleryAlbum, HomeIntroSlide, HomePageData } from '#shared/types/home'
import type { NewsCardItem, NewsTagVariant } from '#shared/types/news'
import type { HomeResponseDto, HomeSlideDto } from '#shared/types/dto/home'
import { asRecord, sitePath, text } from '#shared/utils/apiRecord'
import { formatApiDate } from '#shared/utils/formatApiDate'
import { formatApiPeriodUntil } from '#shared/utils/formatApiPeriod'
import { resolveAlt } from '#shared/utils/resolveAlt'

const FEED_TAGS: Record<string, { tagLabel: string; tagVariant: NewsTagVariant }> = {
  news: { tagLabel: 'Новость', tagVariant: 'news' },
  action: { tagLabel: 'Акция', tagVariant: 'action' },
  smi: { tagLabel: 'СМИ о нас', tagVariant: 'smi' },
}

export function mapHome(dto: HomeResponseDto): HomePageData {
  return {
    slides: mapHomeIntroSlides(dto),
    feed: mapHomeFeed(dto.data.feed),
    brands: mapHomeBrands(dto.data.brands),
    categories: mapHomeCategories(dto.data.categories),
    gallery: mapHomeGallery(dto.data.gallery),
    videoUrl: text(dto.data.video_url) || null,
  }
}

export function mapHomeIntroSlides(dto: HomeResponseDto): HomeIntroSlide[] {
  return dto.data.slides.flatMap((slide) => {
    const mapped = mapHomeIntroSlide(slide)
    return mapped ? [mapped] : []
  })
}

export function mapHomeFeed(items: readonly unknown[]): NewsCardItem[] {
  return items.flatMap((item) => {
    const mapped = mapFeedItem(item)
    return mapped ? [mapped] : []
  })
}

/**
 * Схемы элементов `brands[]` в OpenAPI нет, на стенде массив пуст. Поля макета
 * (`shape`, направление ленты) в контракте не появляются — нераспознанный элемент
 * пропускается, и раздел остаётся на моке.
 */
export function mapHomeBrands(items: readonly unknown[]): HomePageData['brands'] {
  void items
  return []
}

/**
 * Плитки категорий: `slug`, `title` и пара картинок (`image_left` / `image_right`) —
 * в админке их две под два кадра блока. Плитка без slug или без одной из картинок
 * ломала бы кадр, поэтому пропускается: остальные показываются из API.
 */
export function mapHomeCategories(items: readonly unknown[]): HomePageData['categories'] {
  return items.flatMap((item) => {
    const record = asRecord(item)
    if (!record) return []

    const id = text(record.slug)
    const leftImageSrc = text(record.image_left)
    const rightImageSrc = text(record.image_right)
    if (!id || !leftImageSrc || !rightImageSrc) return []

    const title = text(record.title)
    const imageAlt = resolveAlt(title)

    return [
      {
        id,
        title,
        leftImageSrc,
        leftImageAlt: imageAlt,
        rightImageSrc,
        rightImageAlt: imageAlt,
      },
    ]
  })
}

export function mapHomeGallery(items: readonly unknown[]): HomeGalleryAlbum[] {
  return items.flatMap((item) => {
    const mapped = mapGalleryItem(item)
    return mapped ? [mapped] : []
  })
}

function mapHomeIntroSlide(slide: HomeSlideDto): HomeIntroSlide | undefined {
  if (typeof slide.image !== 'string') return undefined

  const imageSrc = slide.image.trim()
  if (!imageSrc) return undefined

  const title = typeof slide.title === 'string' ? slide.title : ''
  const description = typeof slide.description === 'string' ? slide.description.trim() : ''
  const imageSrcMobile = typeof slide.image_mobile === 'string' ? slide.image_mobile.trim() : ''

  return {
    id: String(slide.id),
    title,
    ...(description ? { description } : {}),
    imageSrc,
    ...(imageSrcMobile ? { imageSrcMobile } : {}),
    imageAlt: resolveAlt(title),
  }
}

export function mapFeedItem(item: unknown): NewsCardItem | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const id = text(record.slug)
  if (!id) return undefined

  const title = text(record.title)
  const type = text(record.type)
  const tag = FEED_TAGS[type] ?? { tagLabel: type, tagVariant: 'other' as const }
  const source = asRecord(record.source)
  const to = sitePath(record.url)

  return {
    id,
    imageSrc: text(record.image),
    imageAlt: resolveAlt(title),
    date: feedDate(record, type),
    category: source ? text(source.name) : '',
    title,
    tagLabel: tag.tagLabel,
    tagVariant: tag.tagVariant,
    ...(to ? { to } : {}),
  }
}

function feedDate(record: Record<string, unknown>, type: string): string {
  if (type === 'action') {
    const period = asRecord(record.period)
    const until = formatApiPeriodUntil(period ? text(period.to) : '')
    if (until) return until
  }

  return formatApiDate(text(record.date))
}

function mapGalleryItem(item: unknown): HomeGalleryAlbum | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const id = text(record.slug)
  const imageSrc = text(record.cover)
  if (!id || !imageSrc) return undefined

  const title = text(record.title)
  const photoCount = photoCountOf(record.photos_count)

  return {
    id,
    title,
    date: formatApiDate(text(record.date), { numeric: true }),
    imageSrc,
    imageAlt: resolveAlt(title),
    photoCount,
    ...(record.has_video === true ? { hasVideo: true } : {}),
    ...(photoCount > 0 ? { photos: [imageSrc] } : {}),
  }
}

function photoCountOf(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 0
  return Math.floor(value)
}
