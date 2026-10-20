import type { ApiEnvelope } from '#shared/types/api'
import type { ApiEndpoint, ApiQuery, ApiRequest, ApiRouteInput } from './endpoints'
import {
  eventEndpoint,
  eventsEndpoint,
  feedEndpoint,
  feedItemEndpoint,
  galleryAlbumEndpoint,
  homeEndpoint,
  layoutEndpoint,
  pageEndpoint,
  tenantEndpoint,
  tenantsEndpoint,
  vacanciesEndpoint,
} from './endpoints'
import { ApiContractError } from './errors'

/**
 * Прямые запросы клиента в Laravel — режим статического хостинга, где серверных
 * ручек Nitro нет. Включается абсолютным `runtimeConfig.public.apiBase` (проверка —
 * `isDirectApiBase` из `./directBase`): относительная база или пустое значение
 * оставляют работу через прокси `/api/*`.
 */

/** Ручка, найденная по пути. Типы параметров замкнуты в фабрике {@link routePattern}. */
export type ApiRouteLoader = {
  /** Путь ручки без параметра (`/api/feed`) — он же ключ данных Nuxt. */
  route: string
  load: (request: ApiRequest) => Promise<unknown>
}

type RoutePattern = {
  route: string
  load: (request: ApiRequest, input: ApiRouteInput) => Promise<unknown>
}

/** Замыкает `Params` ручки: наружу список ручек однороден, внутри типы сохранены. */
function routePattern<Params, Data>(endpoint: ApiEndpoint<Params, Data>): RoutePattern {
  return {
    route: endpoint.route,
    load: (request, input) => endpoint.load(request, endpoint.params(input)),
  }
}

/** Порядок не важен: путь и сегмент `:slug` сравниваются по числу сегментов. */
const ROUTE_PATTERNS: readonly RoutePattern[] = [
  routePattern(homeEndpoint),
  routePattern(layoutEndpoint),
  routePattern(pageEndpoint),
  routePattern(eventsEndpoint),
  routePattern(eventEndpoint),
  routePattern(feedEndpoint),
  routePattern(feedItemEndpoint),
  routePattern(galleryAlbumEndpoint),
  routePattern(tenantsEndpoint),
  routePattern(tenantEndpoint),
  routePattern(vacanciesEndpoint),
]

/** Путь `/api/*` с query — как его собирает `useApiFetch`; абсолютный URL тоже принимается. */
function parseApiUrl(url: string): { pathname: string; query: ApiQuery } {
  const parsed = new URL(url, 'http://api.local')
  const pathname = parsed.pathname.replace(/\/+$/, '')

  return {
    pathname: pathname === '' ? '/' : pathname,
    query: Object.fromEntries(parsed.searchParams.entries()),
  }
}

/** Сегменты пути совпадают, `:slug` забирает сегмент целиком. */
function matchRoute(route: string, pathname: string): { slug?: string } | null {
  const patternParts = route.split('/')
  const pathParts = pathname.split('/')

  if (patternParts.length !== pathParts.length) return null

  let slug: string | undefined

  for (const [index, part] of patternParts.entries()) {
    const value = pathParts[index]

    if (part === ':slug') {
      if (!value) return null
      slug = decodeURIComponent(value)
      continue
    }

    if (part !== value) return null
  }

  return slug === undefined ? {} : { slug }
}

/**
 * Находит ручку по пути `/api/*`. Дополнительный `query` дописывается поверх URL:
 * так императивные вызовы («показать ещё») переиспользуют тот же контракт.
 */
export function resolveApiRoute(url: string, query?: ApiQuery): ApiRouteLoader | null {
  const parsed = parseApiUrl(url)
  const merged: ApiRouteInput['query'] = { ...parsed.query, ...query }

  for (const pattern of ROUTE_PATTERNS) {
    const match = matchRoute(pattern.route, parsed.pathname)

    if (match) {
      return {
        route: pattern.route,
        load: (request) => pattern.load(request, { query: merged, slug: match.slug }),
      }
    }
  }

  return null
}

export type DirectApiOptions = {
  /** Путь ручки вместе с query: `/api/feed?type=smi&page=1`. */
  url: string
  /** HTTP-клиент с базой Laravel. */
  request: ApiRequest
  /** Query поверх URL — для императивных вызовов. */
  query?: ApiQuery
}

/**
 * Данные ручки конвертом, как их отдаёт Nitro-прокси: выше этой границы режимы
 * (прокси и прямые запросы) неразличимы, поэтому composables не меняются.
 * Тип ответа задаёт вызывающий — как и в `useFetch` (`useApiFetch<T>`).
 */
export async function loadDirectApi<Result = ApiEnvelope<unknown>>(
  options: DirectApiOptions,
): Promise<Result> {
  const route = resolveApiRoute(options.url, options.query)

  if (!route) {
    throw new ApiContractError(404, `Unknown API route: ${options.url}`)
  }

  return { data: await route.load(options.request) } as Result
}
