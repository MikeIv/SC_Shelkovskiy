import type { ApiListMeta } from '#shared/types/api'
import type { ApiSeo } from '#shared/types/seo'

export type NewsTagVariant = 'action' | 'afisha' | 'news' | 'other' | 'smi' | 'loyalty' | 'lunch'

export type NewsFilterTab = 'news' | 'action' | 'smi'

/** Раздел «связанных» материалов на детальной: тот же тег, для новостей — всё, кроме СМИ. */
export type NewsRelatedKind = 'news' | 'action' | 'smi'

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
  /** Та же дата в ISO — для `<time datetime>`, роботов и скринридеров. */
  publishedAtIso?: string
  /** Срок акции на детали: чип «Срок акции: …». */
  period?: string
  gallery?: string[]
  intro?: string[]
  sections?: NewsDetailSection[]
  tenant?: NewsDetailTenant
  /**
   * Текст записи из API — HTML из CMS, очищенный маппером.
   * Мок отдаёт структуру `intro`/`sections`, поэтому в UI два варианта вывода.
   */
  bodyHtml?: string
  seo?: ApiSeo | null
}

/** Ответ прокси `/api/feed`: карточки страницы и пагинация Laravel. */
export type NewsListData = {
  items: NewsCardItem[]
  meta: ApiListMeta | null
}

/** Ответ прокси `/api/feed/{slug}`: детальная и связанные записи того же тега. */
export type NewsDetailData = {
  item: NewsDetailItem
  related: NewsCardItem[]
}
