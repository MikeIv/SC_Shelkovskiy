export type NewsTagVariant = 'action' | 'afisha' | 'news' | 'other' | 'smi' | 'loyalty' | 'lunch'

export type NewsFilterTab = 'news' | 'action' | 'smi'

export type NewsCardLayout = 'slider' | 'catalog'

export type NewsDetailSection = {
  heading?: string
  paragraphs?: string[]
  list?: string[]
  quote?: string
}

export type NewsDetailTenant = {
  logoSrc?: string
  logoAlt?: string
  floor?: string
  mapUrl?: string
}

export type NewsCardItem = {
  id: string
  /** Изображение; пустое значение — заглушка в UI. */
  imageSrc: string
  imageAlt: string
  /** Дата публикации или срок акции. */
  date: string
  /** Название бренда. */
  category: string
  /** Заголовок: до 3 строк, далее троеточие. */
  title: string
  tagLabel: string
  tagVariant?: NewsTagVariant
  /** Детальная страница; если не задан — строится из `id`. */
  to?: string
}

export type NewsDetailItem = NewsCardItem & {
  /** Полная дата для детальной страницы. */
  publishedAt?: string
  /** Срок акции на детали: чип «Срок акции: …». */
  period?: string
  gallery?: string[]
  intro?: string[]
  sections?: NewsDetailSection[]
  tenant?: NewsDetailTenant
}
