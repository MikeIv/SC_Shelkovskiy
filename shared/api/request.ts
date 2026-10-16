import type { ApiWriteMethod, HttpMethod } from '#shared/types/api'

/**
 * Контракт запроса к API — без зависимостей.
 *
 * Модуль вынесен отдельно от `endpoints.ts`, чтобы клиентский граф в режиме прокси не тянул
 * контракты ручек, мапперы и DTO: `useApi` нужен только сам вызов, а не список ручек.
 */

/** Значения query: из URL на клиенте, из `getQuery` в Nitro. */
export type ApiQuery = Record<string, unknown>

/** Опции запроса: query для чтения, method/body для записи. */
export type ApiRequestOptions = {
  query?: ApiQuery
  method?: HttpMethod
  body?: unknown
}

/** Опции мутации: метод записи и тело. */
export type ApiWriteOptions = {
  method: ApiWriteMethod
  body: unknown
}

/** Запрос на чтение: путь относительно базы API и опциональный query. */
export type ApiRequest = <Dto>(path: string, options?: { query?: ApiQuery }) => Promise<Dto>

/**
 * Запрос на запись. Отдельный контракт, чтобы метод и тело нельзя было передать
 * в транспорт чтения: в прямом режиме `useApi` умеет только GET.
 */
export type ApiWriteRequest = <Dto>(path: string, options: ApiWriteOptions) => Promise<Dto>

/**
 * Тот же вызов до приведения к {@link ApiRequest} / {@link ApiWriteRequest}:
 * `$fetch` типизирован маршрутами Nitro, а пути здесь динамические — сравнение объединения
 * маршрутов упирается в предел глубины типов TS.
 */
export type RawApiClient = (path: string, options?: ApiRequestOptions) => Promise<unknown>

/** Приводит `$fetch`-подобный клиент к контракту {@link ApiRequest}: тип ответа задаёт вызывающий. */
export function asApiRequest(client: RawApiClient): ApiRequest {
  return <Dto>(path: string, options?: { query?: ApiQuery }) =>
    client(path, options) as Promise<Dto>
}

/** Приводит `$fetch`-подобный клиент к контракту {@link ApiWriteRequest}. */
export function asApiWriteRequest(client: RawApiClient): ApiWriteRequest {
  return <Dto>(path: string, options: ApiWriteOptions) => client(path, options) as Promise<Dto>
}
