import type { Ref } from 'vue'
import type { ApiEnvelope, ApiListMeta } from '#shared/types/api'
import type { NewsCardItem, NewsFilterTab, NewsListData } from '#shared/types/news'
import { newsRelatedKind } from '#shared/utils/newsTag'
import { newsCatalogItems } from '~/data/newsCatalogItems'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'

const PER_PAGE = 12

/**
 * Лента `/news`. Вкладка — это `type` API, «показать ещё» догружает следующую страницу
 * и дописывает карточки к уже показанным.
 *
 * Первая страница идёт через `useApiFetch` (SSR + payload), догрузка — императивно
 * `useApi()` по клику: на сервере относительный URL к своему же origin не собрать.
 */
export async function useFeed(tab: Ref<NewsFilterTab>) {
  const api = useApi()
  const first = await useApiFetch<ApiEnvelope<NewsListData>>(
    computed(() => `/api/feed?type=${tab.value}&page=1&per_page=${PER_PAGE}`),
  )

  const extra = ref<NewsCardItem[]>([])
  const extraMeta = ref<ApiListMeta | null>(null)
  const loadingMore = ref(false)

  const isFallback = computed(() => first.error.value != null || first.data.value == null)

  const firstPage = computed<NewsListData>(() => {
    if (isFallback.value || first.data.value == null) return fallbackList(tab.value)
    return first.data.value.data
  })

  const items = computed(() => [...firstPage.value.items, ...extra.value])
  const meta = computed(() => extraMeta.value ?? firstPage.value.meta)
  const hasMore = computed(() => {
    const current = meta.value
    return current != null && current.current_page < current.last_page
  })

  watch(tab, () => {
    extra.value = []
    extraMeta.value = null
  })

  /**
   * Признак демо-данных: первая страница пришла из мока, а не из API. Источник включает
   * вкладку, а прежнюю вкладку снимаем — иначе список источников копится за сессию.
   */
  const demoSource = ref<string | null>(null)

  watch(
    [isFallback, tab],
    ([fallbackUsed, currentTab]) => {
      if (demoSource.value) unmarkDemoData(demoSource.value)

      demoSource.value = fallbackUsed ? `/api/feed?type=${currentTab}` : null

      if (demoSource.value) markDemoData(demoSource.value)
    },
    { immediate: true },
  )

  async function loadMore(): Promise<void> {
    const current = meta.value
    if (loadingMore.value || current == null || current.current_page >= current.last_page) return

    const requestedTab = tab.value
    loadingMore.value = true

    try {
      const response = await api<ApiEnvelope<NewsListData>>('/api/feed', {
        query: { type: requestedTab, page: current.current_page + 1, per_page: PER_PAGE },
      })

      /** Вкладку могли переключить, пока шёл запрос: чужую страницу не дописываем. */
      if (tab.value !== requestedTab) return

      extra.value = [...extra.value, ...response.data.items]
      extraMeta.value = response.data.meta
    } catch {
      /* Сеть отвалилась — кнопка остаётся, уже показанные карточки не трогаем. */
    } finally {
      loadingMore.value = false
    }
  }

  return {
    items,
    meta,
    hasMore,
    isFallback,
    loadingMore,
    loadMore,
    error: first.error,
    pending: first.pending,
  }
}

/** Мок раздела, когда upstream не настроен: вкладка фильтрует тот же список, что и API. */
function fallbackList(tab: NewsFilterTab): NewsListData {
  return {
    items: newsCatalogItems.filter((item) => newsRelatedKind(item.tagVariant) === tab),
    meta: null,
  }
}
