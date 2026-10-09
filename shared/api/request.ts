/**
 * Контракт запроса к API — без зависимостей.
 *
 * Модуль вынесен отдельно от `endpoints.ts`, чтобы клиентский граф в режиме прокси не тянул
 * контракты ручек, мапперы и DTO: `useApi` нужен только сам вызов, а не список ручек.
 */

/** Значения query: из URL на клиенте, из `getQuery` в Nitro. */
export type ApiQuery = Record<string, unknown>

/** Запрос к API: путь относительно базы API и опциональный query. */
export type ApiRequest = <Dto>(path: string, options?: { query?: ApiQuery }) => Promise<Dto>

/**
 * Тот же вызов до приведения к {@link ApiRequest}: `$fetch` типизирован маршрутами Nitro,
 * а пути здесь динамические — сравнение объединения маршрутов упирается в предел глубины типов TS.
 */
export type RawApiClient = (path: string, options?: { query?: ApiQuery }) => Promise<unknown>

/** Приводит `$fetch`-подобный клиент к контракту {@link ApiRequest}: тип ответа задаёт вызывающий. */
export function asApiRequest(client: RawApiClient): ApiRequest {
  return <Dto>(path: string, options?: { query?: ApiQuery }) =>
    client(path, options) as Promise<Dto>
}
