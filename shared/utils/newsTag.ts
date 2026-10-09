import type { NewsFilterTab, NewsRelatedKind, NewsTagVariant } from '#shared/types/news'

/** Вкладки `/news`. Порядок — как в макете. */
export const NEWS_FILTER_TABS = [
  'news',
  'action',
  'smi',
] as const satisfies readonly NewsFilterTab[]

export function isNewsFilterTab(value: string): value is NewsFilterTab {
  return (NEWS_FILTER_TABS as readonly string[]).includes(value)
}

/** Раздел «связанных» материалов: свой тег, для новостей — все, кроме СМИ. */
export function newsRelatedKind(variant: NewsTagVariant | undefined): NewsRelatedKind {
  return variant === 'action' || variant === 'smi' ? variant : 'news'
}
