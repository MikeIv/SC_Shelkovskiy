import type { AsyncData, UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'
import type { ApiQuery, ApiRequest, RawApiClient } from '#shared/api/request'
import { asApiRequest } from '#shared/api/request'
import { isDirectApiBase } from '#shared/api/directBase'
import { apiErrorInfo } from '#shared/api/errors'
import { withThrottleRetry } from '#shared/api/throttle'
import { joinApiUrl, normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'

/**
 * Режимы данных выбирает `runtimeConfig.public.apiBase`:
 *
 * - **прокси** (пусто или относительный путь) — клиент зовёт свои ручки Nitro `/api/*`,
 *   а они ходят в Laravel с Basic из приватного `runtimeConfig`;
 * - **прямой** (абсолютный URL) — режим статического хостинга, где серверных ручек нет:
 *   браузер идёт в Laravel сам, а контракт (путь, проверка формы, маппинг) берётся
 *   из `shared/api/endpoints`. Требует CORS на API и не умеет Basic — иначе секрет
 *   стенда попал бы в бандл.
 *
 * Для вызывающего кода оба режима неразличимы: наружу всегда `ApiEnvelope<UI-тип>`.
 */

/** HTTP-клиент данных: путь ручки `/api/*` плюс query. */
export type ApiClient = ApiRequest

/**
 * `$fetch` с базой API и dev-логом ошибок: транспорт для обоих режимов.
 *
 * Тип — {@link RawApiClient}: `$fetch` типизирован маршрутами Nitro, а пути здесь динамические.
 */
/**
 * Таймаут запроса в браузере. Серверный транспорт ограничен на стороне Nitro
 * (`server/utils/apiFetch.ts`), а прямой режим идёт из браузера: без потолка обрыв сети
 * оставляет `refresh` висеть, и страница навсегда остаётся в `pending`.
 */
const CLIENT_TIMEOUT_MS = 10_000

function createApiClient(): RawApiClient {
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: normalizeApiBaseUrl(config.public.apiBase),
    timeout: CLIENT_TIMEOUT_MS,
    /**
     * `Accept: application/json` — правило API: без него Laravel отвечает редиректом
     * вместо ошибки валидации. Ставим на транспорт, чтобы прямой режим не зависел от того,
     * какой `Accept` подставит `useFetch`.
     */
    headers: { Accept: 'application/json' },
    onResponseError(ctx) {
      if (import.meta.dev) {
        console.error('[useApi]', String(ctx.request), ctx.response.status, ctx.response._data)
      }
    },
  }) as unknown as RawApiClient
}

/**
 * Транспорт к Laravel. На сервере (пререндер статики) добавляем ожидание окна лимита API:
 * сборка обходит сотни страниц и без этого получает 429 на детальных страницах.
 * В браузере лимит держит сервер, а пауза в полминуты испортила бы навигацию.
 */
function createTransport(): ApiRequest {
  const request = asApiRequest(createApiClient())

  return import.meta.server ? withThrottleRetry(request) : request
}

/**
 * Прямой режим нужен только статическому стенду, а контракты ручек тянут мапперы и DTO:
 * грузим модуль по требованию, чтобы прокси-сборка не тащила его в клиентский граф.
 */
async function loadDirect<T>(url: string, request: ApiRequest, query?: ApiQuery): Promise<T> {
  const { loadDirectApi } = await import('#shared/api/direct')

  return loadDirectApi<T>({ url, request, query })
}

/** Императивный HTTP-клиент (`ofetch`) к данным в режиме текущей сборки. */
export function useApi(): ApiClient {
  const transport = createTransport()

  if (!isDirectApiBase(useRuntimeConfig().public.apiBase)) return transport

  return <Dto>(path: string, options?: { query?: ApiQuery }) =>
    loadDirect<Dto>(path, transport, options?.query)
}

/**
 * Реактивный `useFetch` к тому же API, что и {@link useApi}: URL собирается из `apiBase` + путь.
 *
 * В прямом режиме запрос идёт через `useAsyncData` (ключ — путь нашей ручки, одинаковый
 * на сервере и клиенте), поэтому payload, гидрация и `refresh` ведут себя как у `useFetch`.
 * Второй аргумент — без `baseURL` и без дженерика на `UseFetchOptions` (ограничение типов Nuxt 4);
 * тип ответа задаётся параметром `T` у возвращаемого `AsyncData<T, …>`.
 */
export function useApiFetch<T = unknown>(
  path: MaybeRefOrGetter<string>,
  options?: Omit<UseFetchOptions<unknown>, 'baseURL'>,
): AsyncData<T, FetchError | null> {
  const config = useRuntimeConfig()

  if (!isDirectApiBase(config.public.apiBase)) {
    const request = computed(() => joinApiUrl(config.public.apiBase, String(toValue(path))))

    return useFetch(request, { timeout: CLIENT_TIMEOUT_MS, ...options }) as AsyncData<
      T,
      FetchError | null
    >
  }

  const route = computed(() => String(toValue(path)))
  /**
   * Транспорт берём «сырым»: путь `/api/*` разрешает `loadDirectApi`, а режимный клиент
   * разрешал бы его вторым проходом — уже как путь Laravel.
   */
  const request = createTransport()

  /**
   * Пейлоад сборки читаем через захваченный `nuxtApp`: значение нужно и вне контекста setup —
   * после сбоя запроса, когда `useNuxtApp()` уже недоступен.
   */
  const nuxtApp = useNuxtApp()
  const prerendered = <Dto>(key: string): Dto | undefined => {
    const payloadData: unknown = nuxtApp.payload.data

    if (typeof payloadData !== 'object' || payloadData === null) return undefined

    return (payloadData as Record<string, Dto | undefined>)[key]
  }

  const asyncData = useAsyncData<T>(
    route,
    async () => {
      try {
        return await loadDirect<T>(route.value, request)
      } catch (error) {
        /**
         * Статика без сервера: неудачная ревалидация не должна подменять показанное моками.
         * Данные сборки уже отрисованы и остаются запасным вариантом (нет CORS, API лежит).
         */
        const built = prerendered<T>(route.value)

        if (built != null) return built

        throw createError(apiErrorInfo(error))
      }
    },
    {
      lazy: options?.lazy,
      server: options?.server,
      immediate: options?.immediate,
      /**
       * Статика без сервера: кэш отдаём только на первый кадр гидратации — там данные сборки.
       * Поэтому `refresh` после неё и клиентские переходы всегда идут в API: правка в админке
       * видна без деплоя.
       */
      getCachedData: (key, app, context) =>
        app.isHydrating && context.cause === 'initial' ? prerendered<T>(key) : undefined,
    },
  ) as AsyncData<T, FetchError | null>

  /**
   * Гидратация показывает данные сборки, поэтому актуальное дотягиваем сразу после неё:
   * правки в админке видны без пересборки статики.
   */
  if (import.meta.client && getCurrentInstance() && options?.immediate !== false) {
    onMounted(() => {
      void asyncData.refresh()
    })
  }

  return asyncData
}
