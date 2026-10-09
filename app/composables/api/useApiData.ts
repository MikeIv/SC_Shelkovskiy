import type { AsyncData, UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'

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

  const isFallback = computed(() => result.error.value != null || result.data.value == null)

  const data = computed<T>(() => {
    if (isFallback.value || result.data.value == null) return fallbackData
    return result.data.value
  })

  return {
    data,
    isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
