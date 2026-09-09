export type LoyaltyStoreLink = {
  id: string
  label: string
  href: string
  imageSrc: string
  width: number
  height: number
}

export type LoyaltyBenefit = {
  id: string
  icon: string
  text: string
}

export type LoyaltyJoinStep = {
  id: string
  number: string
  title: string
  variant: 'stores' | 'auth' | 'profile'
  imageSrc?: string
  imageWidth?: number
  imageHeight?: number
}

export type LoyaltyPointStep = {
  id: string
  number: string
  text: string
}

export type LoyaltyLevel = {
  id: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  perks: string[]
}
