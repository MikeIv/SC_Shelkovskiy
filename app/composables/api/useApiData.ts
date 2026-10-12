import type { AsyncData, UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'

type UseApiDataResult<T> = {
  data: ComputedRef<T>
  isFallback: ComputedRef<boolean>
  error: AsyncData<T, FetchError | null>['error']
  pending: AsyncData<T, FetchError | null>['pending']
  refresh: AsyncData<T, FetchError | null>['refresh']
}

/**
 * `useApiFetch` с моком: мок, если запрос завершился ошибкой или тела нет.
 * Фабрика фолбэка вызывается один раз на экземпляр composable.
 */
export function useApiData<T>(
  path: MaybeRefOrGetter<string>,
  fallback: () => T,
  options?: Omit<UseFetchOptions<unknown>, 'baseURL'>,
): UseApiDataResult<T> {
  const result = useApiFetch<T>(path, options)
  const fallbackData = fallback()
  const source = computed(() => `/api${String(toValue(path))}`)

  const isFallback = computed(() => result.error.value != null || result.data.value == null)

  const data = computed<T>(() => {
    if (isFallback.value || result.data.value == null) return fallbackData
    return result.data.value
  })

  /**
   * Плашка «демо-данные»: видна, пока запрос не отдал данные. Императивный `refresh`
   * после гидратации может вернуть ответ API — тогда признак снимается сам.
   */
  watch(
    isFallback,
    (fallbackUsed) => {
      if (fallbackUsed) markDemoData(source.value)
      else unmarkDemoData(source.value)
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
