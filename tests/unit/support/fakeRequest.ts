import type { ApiQuery, ApiRequest } from '#shared/api/endpoints'

export type RecordedRequest = { path: string; query?: ApiQuery }

/**
 * Клиент запросов для тестов контрактов: подменяет HTTP и записывает, что и с каким query
 * ушло бы в Laravel. Общий для `apiEndpoints` и `apiRoutes` — форма запроса у обоих режимов одна.
 */
export function fakeRequest(resolve: (path: string) => unknown): {
  request: ApiRequest
  calls: RecordedRequest[]
} {
  const calls: RecordedRequest[] = []
  const request: ApiRequest = <Dto>(path: string, options?: { query?: ApiQuery }) => {
    calls.push({ path, query: options?.query })

    return Promise.resolve(resolve(path)) as Promise<Dto>
  }

  return { request, calls }
}
