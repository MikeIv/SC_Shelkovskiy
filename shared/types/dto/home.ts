/** Слайд `GET /home`. Остальные поля ответа в этой волне не мапятся. */
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
 * Тело `GET /home`. `feed`, `brands`, `categories`, `gallery` описаны как есть
 * и разбираются в следующих волнах.
 */
export type HomeResponseDto = {
  data: {
    slides: HomeSlideDto[]
    feed: unknown[]
    brands: unknown[]
    categories: unknown[]
    gallery: unknown[]
    video_url: string | null
  }
}
