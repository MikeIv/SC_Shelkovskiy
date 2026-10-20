import type { ApiEnvelope } from '#shared/types/api'
import type { PageData } from '#shared/types/page'
import type { RulesDocument } from '#shared/types/rules'

const rulesPageTitle = 'Правила'

/** Что читает страница «Правила»: заголовок, файлы и SEO. */
export type RulesPageView = {
  title: string
  documents: RulesDocument[]
  seoTitle: string
  seoDescription: string | undefined
  seoKeywords: string | undefined
  seoOgImage: string | undefined
}

/**
 * Страница «Правила»: `GET /api/pages/rules`.
 * Файлы — из блока `documents`. Мок не подставляем: `href: '#'` на месте живых ссылок
 * хуже пустого списка, поэтому пустой и ошибочный ответ показывает сама страница.
 */
export function useRulesPage() {
  const result = useApiFetch<ApiEnvelope<PageData>>('/api/pages/rules')

  const page = computed(() => resolveRulesPage(result.data.value?.data))

  return {
    page,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}

function resolveRulesPage(api: PageData | undefined): RulesPageView {
  const title = api?.title || rulesPageTitle

  return {
    title,
    documents: (api?.documents ?? []).map((item, index) => ({
      id: `${index}:${item.url}`,
      title: item.title,
      href: item.url,
    })),
    seoTitle: api?.seo?.title || title,
    seoDescription: api?.seo?.description || undefined,
    seoKeywords: api?.seo?.keywords || undefined,
    seoOgImage: api?.seo?.ogImage || undefined,
  }
}
