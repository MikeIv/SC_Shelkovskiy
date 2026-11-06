import { readdirSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import {
  awardEndpoint,
  awardsEndpoint,
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
} from '#shared/api/endpoints'
import { readApiQuery, readApiSlug } from '../../server/utils/apiQuery'
import awardsIndexRoute from '../../server/api/awards/index.get'
import awardRoute from '../../server/api/awards/[slug].get'
import eventsIndexRoute from '../../server/api/events/index.get'
import eventRoute from '../../server/api/events/[slug].get'
import feedIndexRoute from '../../server/api/feed/index.get'
import feedItemRoute from '../../server/api/feed/[slug].get'
import galleryRoute from '../../server/api/gallery/[slug].get'
import homeRoute from '../../server/api/home.get'
import layoutRoute from '../../server/api/layout.get'
import pageRoute from '../../server/api/pages/[slug].get'
import tenantsIndexRoute from '../../server/api/tenants/index.get'
import tenantRoute from '../../server/api/tenants/[slug].get'
import vacanciesRoute from '../../server/api/vacancies.get'

/**
 * Маршруты `server/api/*` — по четыре строки `defineApiProxy(...)`. Уникального у них только
 * пара «контракт + читатели входа», поэтому подменяем `defineApiProxy` и сверяем подключение,
 * а не повторяем конверт, кэш и ошибки в тринадцати файлах (`apiProxy.test.ts`).
 */

vi.mock('../../server/utils/apiProxy', () => ({
  defineApiProxy: (endpoint: unknown, readers?: unknown) => ({ endpoint, readers }),
}))

type RouteCase = {
  file: string
  module: unknown
  endpoint: unknown
  readers?: { query?: unknown; slug?: unknown }
}

const routes = [
  { file: 'home.get.ts', module: homeRoute, endpoint: homeEndpoint },
  { file: 'layout.get.ts', module: layoutRoute, endpoint: layoutEndpoint },
  { file: 'vacancies.get.ts', module: vacanciesRoute, endpoint: vacanciesEndpoint },
  { file: 'awards/index.get.ts', module: awardsIndexRoute, endpoint: awardsEndpoint },
  {
    file: 'awards/[slug].get.ts',
    module: awardRoute,
    endpoint: awardEndpoint,
    readers: { slug: readApiSlug },
  },
  {
    file: 'events/index.get.ts',
    module: eventsIndexRoute,
    endpoint: eventsEndpoint,
    readers: { query: readApiQuery },
  },
  {
    file: 'events/[slug].get.ts',
    module: eventRoute,
    endpoint: eventEndpoint,
    readers: { slug: readApiSlug },
  },
  {
    file: 'feed/index.get.ts',
    module: feedIndexRoute,
    endpoint: feedEndpoint,
    readers: { query: readApiQuery },
  },
  {
    file: 'feed/[slug].get.ts',
    module: feedItemRoute,
    endpoint: feedItemEndpoint,
    readers: { slug: readApiSlug },
  },
  {
    file: 'gallery/[slug].get.ts',
    module: galleryRoute,
    endpoint: galleryAlbumEndpoint,
    readers: { slug: readApiSlug },
  },
  {
    file: 'pages/[slug].get.ts',
    module: pageRoute,
    endpoint: pageEndpoint,
    readers: { slug: readApiSlug },
  },
  {
    file: 'tenants/index.get.ts',
    module: tenantsIndexRoute,
    endpoint: tenantsEndpoint,
    readers: { query: readApiQuery },
  },
  {
    file: 'tenants/[slug].get.ts',
    module: tenantRoute,
    endpoint: tenantEndpoint,
    readers: { slug: readApiSlug },
  },
] as const satisfies readonly RouteCase[]

describe('маршруты server/api', () => {
  it('покрывают все GET-ручки каталога `server/api`', () => {
    const files = readdirSync(new URL('../../server/api', import.meta.url), { recursive: true })
      .map((entry) => String(entry).replace(/\\/g, '/'))
      .filter((entry) => entry.endsWith('.get.ts'))
      /** «Кино» ходит не в Laravel, а в Афишу: у ручки свой тест `cinema.get.test.ts`. */
      .filter((entry) => entry !== 'cinema.get.ts')
      .sort()

    expect(files).toEqual(routes.map((route) => route.file).sort())
  })

  it.each(routes)('$file подключён к своему контракту', ({ module, endpoint, readers }) => {
    expect(module).toEqual({ endpoint, readers })
  })
})
