import type { NewsCardItem } from '#shared/types/news'

export type HomeIntroSlide = {
  id: string
  title: string
  description?: string
  /** Desktop / широкий кадр. */
  imageSrc: string
  /** Портретный кадр для mobile (до desktop). */
  imageSrcMobile?: string
  imageAlt: string
}

export type HomeBrandShape = 'circle' | 'squircle'

export type HomeBrandImageCrop = 'wide' | 'ekonika'

export type HomeBrandItem = {
  id: string
  name: string
  imageSrc: string
  imageAlt: string
  shape: HomeBrandShape
  imageCrop?: HomeBrandImageCrop
}

export type HomeBrandRow = {
  id: string
  direction: 'rtl' | 'ltr'
  items: HomeBrandItem[]
}

export type HomeLoyaltyCardVariant = 'loyalty' | 'gift'

export type HomeLoyaltyCard = {
  id: string
  title: string
  description: string
  variant: HomeLoyaltyCardVariant
  illustrationAlt: string
  illustrationSrc?: string
  shadowBackSrc?: string
  giftCardFrontSrc?: string
  giftCardBackSrc?: string
  buttonLabel: string
  to?: string
}

export type HomeShopCategoryImageCrop = 'wide'

export type HomeShopCategory = {
  id: string
  title: string
  leftImageSrc: string
  leftImageAlt: string
  rightImageSrc: string
  rightImageAlt: string
  leftImageCrop?: HomeShopCategoryImageCrop
}

export type HomeCinemaFilm = {
  id: string
  title: string
  genres: string
  posterSrc: string
  posterAlt: string
  ageRating?: string
  /** URL билетного сервиса; `#` — заглушка до интеграции */
  ticketUrl?: string
  /** id произведения в Афише — по нему открывается её виджет покупки */
  creationId?: string
  /** Продажа билетов открыта: карточка включает кнопку «Купить билет» */
  onSale?: boolean
  /** Время ближайшего сеанса `22:00` по Москве */
  sessionTime?: string
  /** Минимальная цена билета на ближайшие сеансы, ₽ */
  priceFrom?: number
}

export type HomeGalleryAlbum = {
  id: string
  title: string
  date: string
  imageSrc: string
  imageAlt: string
  photoCount: number
  /** В альбоме есть видео: при `photoCount: 0` карточка помечается «Видео» и не открывает просмотрщик. */
  hasVideo?: boolean
  /** Фото альбома для lightbox; без `to` карточка открывает просмотр. */
  photos?: string[]
  to?: string
}

/** Ответ `/api/home`: UI-типы, те же, что у моков главной. */
export type HomePageData = {
  slides: HomeIntroSlide[]
  feed: NewsCardItem[]
  brands: HomeBrandRow[]
  categories: HomeShopCategory[]
  gallery: HomeGalleryAlbum[]
  /** Ссылка на видео со стенда. На главной не выводится: ролика в макете нет. */
  videoUrl: string | null
}
