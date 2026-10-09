import type { ApiEnvelope } from '#shared/types/api'
import type { LayoutData } from '#shared/types/layout'
import { resolveLayoutView } from '#shared/utils/resolveLayout'
import { staticLayoutData } from '~/utils/staticLayout'

/**
 * Один запрос `/api/layout` на сессию. Вызывать из `app.vue`:
 * страницы читают уже заполненный `useLayoutStore`.
 * Имя не `useLayout`: так называется встроенный composable Nuxt.
 */
export async function useSiteLayout() {
  /**
   * Стор резолвим до `await`: после него теряется контекст инъекции, и `useStore()`
   * опирается на глобальную активную Pinia, которую `@pinia/nuxt` снимает в `app:rendered`
   * любого параллельного SSR-запроса — рендер падает 500 на всех страницах.
   */
  const store = useLayoutStore()
  const fallbackData = staticLayoutData()
  const result = await useApiFetch<ApiEnvelope<LayoutData>>('/api/layout')

  const isFallback = computed(() => result.error.value != null || result.data.value == null)

  const data = computed<LayoutData>(() => {
    if (isFallback.value || result.data.value == null) return fallbackData
    return resolveLayoutView(result.data.value.data, fallbackData)
  })

  watch(
    [data, isFallback],
    () => {
      store.apply(data.value, isFallback.value)
    },
    { immediate: true },
  )

  return {
    data,
    isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
