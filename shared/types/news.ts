export type NewsTagVariant = 'action' | 'afisha' | 'news' | 'other' | 'smi' | 'loyalty' | 'lunch'

export type NewsCardLayout = 'slider' | 'catalog'

export type NewsCardItem = {
  id: string
  imageSrc: string
  imageAlt: string
  date: string
  category: string
  title: string
  tagLabel?: string
  tagVariant?: NewsTagVariant
  to?: string
}
