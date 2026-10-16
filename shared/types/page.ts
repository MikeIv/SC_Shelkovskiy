import type { ApiSeo } from '#shared/types/seo'

/** Блок `form` страницы-конструктора (`GET /pages/{slug}`). */
export type PageFormBlock = {
  kind: 'lease' | 'ads' | 'feedback'
  title: string
  description: string
}

/**
 * Блок `map_route`. В админке: «долгота, затем широта» —
 * тот же порядок, что у Яндекс.Карт (`[lng, lat]`).
 */
export type PageMapRoute = {
  address: string
  coordinates: [number, number]
}

/**
 * Страница CMS: заголовок, SEO и то, что уже читают готовые экраны.
 * Остальные типы блоков появятся вместе с конструктором страниц.
 */
export type PageData = {
  slug: string
  title: string
  seo: ApiSeo | null
  form: PageFormBlock | null
  mapRoute: PageMapRoute | null
}
