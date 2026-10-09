/** Слайд `GET /home`. */
export type HomeSlideDto = {
  id: number
  title: string | null
  description: string | null
  image: string
  image_mobile: string | null
  video: string | null
  url: string | null
}

/**
 * Карточка `data.feed[]`. В спеке `period` и `source.slug` обязательны,
 * в живом ответе у новостей `period: null`, а `slug` есть только у `kind: tenant`.
 */
export type HomeFeedItemDto = {
  type: string | null
  slug: string | null
  title: string | null
  image: string | null
  date: string | null
  period: {
    from: string | null
    to: string | null
  } | null
  source: {
    kind: string | null
    name: string | null
    slug?: string | null
  } | null
  url: string | null
}

/** Альбом `data.gallery[]`. Списка фото в ручке нет — только обложка. */
export type HomeGalleryItemDto = {
  slug: string | null
  title: string | null
  date: string | null
  cover: string | null
  photos_count: number | null
  has_video: boolean | null
}

/**
 * Тело `GET /home`.
 * `brands[]` и `categories[]` в OpenAPI без схемы элемента и на стенде пустые.
 */
export type HomeResponseDto = {
  data: {
    slides: HomeSlideDto[]
    feed: HomeFeedItemDto[]
    brands: unknown[]
    categories: unknown[]
    gallery: HomeGalleryItemDto[]
    video_url: string | null
  }
}
