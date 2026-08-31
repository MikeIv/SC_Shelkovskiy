export type HomeIntroSlide = {
  id: string
  title: string
  description?: string
  imageSrc: string
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
}
