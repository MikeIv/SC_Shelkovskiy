import type { ApiEnvelope } from '#shared/types/api'
import type { LayoutData } from '#shared/types/layout'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'
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

      /** Пустые `contacts`/`hours` в живом ответе тоже дают демо-блок — это и есть подмена. */
      const contacts = data.value.contacts
      const hours = data.value.hours
      const demoUsed =
        isFallback.value ||
        !contacts?.address ||
        !contacts?.phone ||
        (hours?.week?.length ?? 0) === 0

      if (demoUsed) markDemoData('/api/layout')
      else unmarkDemoData('/api/layout')
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
