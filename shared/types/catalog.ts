export type CatalogCardLayout = 'card' | 'list'

export type CatalogCardTag = 'loyalty' | 'action' | 'lunch'

export type CatalogCardItem = {
  id: string
  imageSrc: string
  imageAlt: string
  category: string
  title: string
  floor: string
  tags?: CatalogCardTag[]
  to?: string
  mapUrl?: string
}
