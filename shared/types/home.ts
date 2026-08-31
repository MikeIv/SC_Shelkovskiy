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
