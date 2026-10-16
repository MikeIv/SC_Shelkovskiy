import type { CatalogListData } from '#shared/types/catalog'
import type { EventItemResponseDto, EventsListResponseDto } from '#shared/types/dto/events'
import type { FeedListResponseDto } from '#shared/types/dto/feed'
import type { GalleryAlbumResponseDto } from '#shared/types/dto/gallery'
import type { HomeResponseDto } from '#shared/types/dto/home'
import type { LayoutResponseDto } from '#shared/types/dto/layout'
import type { PageResponseDto } from '#shared/types/dto/pages'
import type { TenantsListResponseDto } from '#shared/types/dto/tenants'
import type { EventDetailItem, EventsListData } from '#shared/types/events'
import type { GalleryAlbum } from '#shared/types/gallery'
import type { HomePageData } from '#shared/types/home'
import type { LayoutData } from '#shared/types/layout'
import type { PageData } from '#shared/types/page'
import type {
  NewsCardItem,
  NewsDetailData,
  NewsDetailItem,
  NewsFilterTab,
  NewsListData,
} from '#shared/types/news'
import type { TenantCatalog, TenantDetail } from '#shared/types/tenantDetail'
import { isNewsFilterTab, newsRelatedKind } from '#shared/utils/newsTag'
import { mapEventDetail, mapEventsList } from '#shared/utils/mappers/events'
import { mapGalleryAlbumDetail } from '#shared/utils/mappers/gallery'
import { mapHome, mapHomeFeed } from '#shared/utils/mappers/home'
import { mapLayout } from '#shared/utils/mappers/layout'
import { mapFeedList, mapNewsDetail } from '#shared/utils/mappers/news'
import { mapPage } from '#shared/utils/mappers/pages'
import { mapTenantDetail, mapTenantsList } from '#shared/utils/mappers/tenants'
import { isTenantCatalog } from '#shared/utils/tenantPath'
import { ApiContractError, invalidPayload } from './errors'
import { readNumberParam, readSlugParam } from './params'
import { isItemPayload, isListPayload } from './payload'
import type { ApiQuery, ApiRequest } from './request'

/** Типы запроса нужны и тем, кто работает с ручками: реэкспорт без рантайм-зависимостей. */
export type { ApiQuery, ApiRequest, RawApiClient } from './request'

/**
 * Контракты ручек данных: путь, параметры, проверка формы ответа и маппинг DTO → UI.
 *
 * Один и тот же код исполняют оба транспорта:
 * - Nitro-прокси `server/api/*` — когда `public.apiBase` пуст или относительный;
 * - клиент — когда `public.apiBase` указывает на Laravel абсолютным URL (статический
 *   хостинг стенда: серверных ручек там нет, запрос идёт из браузера).
 *
 * Поэтому здесь нет ни h3-, ни Nuxt-глобалей: ошибки контракта — `ApiContractError`,
 * а вход ручки (`query`, `slug`) описывается типом {@link ApiRouteInput}.
 */

/** Вход ручки: query и параметр пути у детальных ручек. */
export type ApiRouteInput = {
  query: ApiQuery
  slug?: string
}

/** Контракт ручки: транспорт получает путь и TTL, вызывающий — готовые UI-данные. */
export type ApiEndpoint<Params, Data> = {
  /** Путь same-origin ручки Nitro; `:slug` — параметр детальной ручки. */
  route: string
  /** Имя и TTL кэша Nitro. */
  cache: { name: string; ttl: number }
  /** Подпись ручки в текстах ошибок. */
  label: string
  /** Параметры запроса: мусор отбивается 400 до обращения к API. */
  params: (input: ApiRouteInput) => Params
  /** Ключ кэша Nitro. */
  key: (params: Params) => string
  /** Путь Laravel относительно базы API. */
  path: (params: Params) => string
  /** Запрос, проверка формы ответа, маппинг и догрузки (связанные материалы). */
  load: (request: ApiRequest, params: Params) => Promise<Data>
}

type NoParams = Record<string, never>
type SlugParams = { slug: string }

const DEFAULT_PER_PAGE = 12
const MAX_PER_PAGE = 50
const RELATED_LIMIT = 4
const HOME_LISTS = ['slides', 'feed', 'brands', 'categories', 'gallery'] as const

/** Главная: слайды, лента, бренды, категории и галерея одним ответом. */
export const homeEndpoint: ApiEndpoint<NoParams, HomePageData> = {
  route: '/api/home',
  cache: { name: 'api-home', ttl: 300 },
  label: 'Home',
  params: () => ({}),
  key: () => 'home',
  path: () => '/home',
  load: async (request) => {
    const dto = await request<HomeResponseDto>('/home')

    if (!isHomeResponseDto(dto)) throw invalidPayload('Home')

    return mapHome(dto)
  },
}

function isHomeResponseDto(value: unknown): value is HomeResponseDto {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false

  const data = value.data
  if (typeof data !== 'object' || data === null) return false

  const record = data as Record<string, unknown>
  return HOME_LISTS.every((key) => Array.isArray(record[key]))
}

/** Общая обвязка сайта: контакты, часы работы, соцсети, приложения и CTA MAX. */
export const layoutEndpoint: ApiEndpoint<NoParams, LayoutData> = {
  route: '/api/layout',
  cache: { name: 'api-layout', ttl: 300 },
  label: 'Layout',
  params: () => ({}),
  key: () => 'layout',
  path: () => '/layout',
  load: async (request) => {
    const dto = await request<LayoutResponseDto>('/layout')

    if (!isLayoutResponseDto(dto)) throw invalidPayload('Layout')

    return mapLayout(dto)
  },
}

function isLayoutResponseDto(value: unknown): value is LayoutResponseDto {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false

  const data = value.data
  if (typeof data !== 'object' || data === null) return false

  const record = data as Record<string, unknown>
  return (
    isObject(record.contacts) &&
    isArrayField(record.contacts, 'departments') &&
    isObject(record.hours) &&
    isArrayField(record.hours, 'week') &&
    isArrayField(record.hours, 'exceptions') &&
    isArrayField(record.hours, 'tenants') &&
    Array.isArray(record.socials) &&
    isObject(record.apps) &&
    isObject(record.cta_max)
  )
}

/**
 * Страница-конструктор `GET /pages/{slug}`: title, seo, blocks.
 * Контакты: title/seo, `form`, `map_route`; адрес и отделы — из `/layout`.
 */
export const pageEndpoint: ApiEndpoint<SlugParams, PageData> = {
  route: '/api/pages/:slug',
  cache: { name: 'api-page', ttl: 300 },
  label: 'Page',
  params: ({ slug }) => ({ slug: readSlugParam(slug, 'Page slug is invalid') }),
  key: ({ slug }) => `page:${slug}`,
  path: ({ slug }) => `/pages/${encodeURIComponent(slug)}`,
  load: async (request, params) => {
    const dto = await request<PageResponseDto>(pageEndpoint.path(params))

    if (!isPageResponseDto(dto)) throw invalidPayload('Page')

    return mapPage(dto)
  },
}

function isPageResponseDto(value: unknown): value is PageResponseDto {
  if (!isItemPayload(value)) return false

  const record = value.data as Record<string, unknown>
  return typeof record.slug === 'string' && Array.isArray(record.blocks)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isArrayField(value: Record<string, unknown>, key: string): boolean {
  return Array.isArray(value[key])
}

type PageParams = { page: number; perPage: number }

/** Афиша: `page`/`per_page` — пагинация Laravel, на стенде 3 записи. */
export const eventsEndpoint: ApiEndpoint<PageParams, EventsListData> = {
  route: '/api/events',
  cache: { name: 'api-events', ttl: 60 },
  label: 'Events',
  params: ({ query }) => ({
    page: readNumberParam(query.page, 1, 1, Number.MAX_SAFE_INTEGER, 'Events page is invalid'),
    perPage: readNumberParam(
      query.per_page,
      DEFAULT_PER_PAGE,
      1,
      MAX_PER_PAGE,
      'Events per_page is invalid',
    ),
  }),
  key: ({ page, perPage }) => `events:${page}:${perPage}`,
  path: ({ page, perPage }) => `/events?${pageQuery(page, perPage)}`,
  load: async (request, params) => {
    const dto = await request<EventsListResponseDto>(eventsEndpoint.path(params))

    if (!isListPayload(dto)) throw invalidPayload('Events')

    return mapEventsList(dto)
  },
}

/** Карточка мероприятия: `when`, место, HTML `text`, программа и `seo`. */
export const eventEndpoint: ApiEndpoint<SlugParams, EventDetailItem> = {
  route: '/api/events/:slug',
  cache: { name: 'api-event', ttl: 300 },
  label: 'Events',
  params: ({ slug }) => ({ slug: readSlugParam(slug, 'Event slug is invalid') }),
  key: ({ slug }) => `event:${slug}`,
  path: ({ slug }) => `/events/${encodeURIComponent(slug)}`,
  load: async (request, params) => {
    const dto = await request<EventItemResponseDto>(eventEndpoint.path(params))

    if (!isItemPayload(dto)) throw invalidPayload('Events')

    const item = mapEventDetail(dto.data)

    if (!item) throw invalidPayload('Events')

    return item
  },
}

/**
 * Альбом галереи `GET /gallery/{slug}`: фото для просмотрщика. Ручка `/home` отдаёт у альбома
 * только обложку, поэтому секция галереи догружает набор по клику.
 */
export const galleryAlbumEndpoint: ApiEndpoint<SlugParams, GalleryAlbum> = {
  route: '/api/gallery/:slug',
  cache: { name: 'api-gallery-album', ttl: 300 },
  label: 'Gallery',
  params: ({ slug }) => ({ slug: readSlugParam(slug, 'Gallery slug is invalid') }),
  key: ({ slug }) => `gallery:${slug}`,
  path: ({ slug }) => `/gallery/${encodeURIComponent(slug)}`,
  load: async (request, params) => {
    const dto = await request<GalleryAlbumResponseDto>(galleryAlbumEndpoint.path(params))

    if (!isItemPayload(dto)) throw invalidPayload('Gallery')

    const album = mapGalleryAlbumDetail(dto.data)

    if (!album) throw invalidPayload('Gallery')

    return album
  },
}

type FeedParams = { type: NewsFilterTab | null; page: number; perPage: number }

/**
 * Страница ленты: `type` — вкладка (`news|action|smi`), `page`/`per_page` — пагинация Laravel.
 * Без `type` живой `/feed` отдаёт новости и акции; СМИ приходят только с `type=smi`.
 */
export const feedEndpoint: ApiEndpoint<FeedParams, NewsListData> = {
  route: '/api/feed',
  cache: { name: 'api-feed', ttl: 60 },
  label: 'Feed',
  params: ({ query }) => ({
    type: readFeedType(query.type),
    page: readNumberParam(query.page, 1, 1, Number.MAX_SAFE_INTEGER, 'Feed page is invalid'),
    perPage: readNumberParam(
      query.per_page,
      DEFAULT_PER_PAGE,
      1,
      MAX_PER_PAGE,
      'Feed per_page is invalid',
    ),
  }),
  key: ({ type, page, perPage }) => `feed:${type ?? 'all'}:${page}:${perPage}`,
  path: ({ type, page, perPage }) => {
    const params = new URLSearchParams(pageQuery(page, perPage))

    if (type) params.set('type', type)

    return `/feed?${params.toString()}`
  },
  load: async (request, params) => {
    const dto = await request<FeedListResponseDto>(feedEndpoint.path(params))

    if (!isListPayload(dto)) throw invalidPayload('Feed')

    return mapFeedList(dto)
  },
}

function readFeedType(value: unknown): NewsFilterTab | null {
  if (value === undefined || value === null || value === '') return null

  if (typeof value !== 'string' || !isNewsFilterTab(value)) {
    throw new ApiContractError(400, 'Feed type is invalid')
  }

  return value
}

/**
 * Детальная записи ленты и связанные материалы того же раздела
 * (`/feed?exclude={slug}`): для новостей — всё, кроме СМИ, для акций и СМИ — свой `type`.
 */
export const feedItemEndpoint: ApiEndpoint<SlugParams, NewsDetailData> = {
  route: '/api/feed/:slug',
  cache: { name: 'api-feed-item', ttl: 300 },
  label: 'Feed',
  params: ({ slug }) => ({ slug: readSlugParam(slug, 'Feed slug is invalid') }),
  key: ({ slug }) => `feed:${slug}`,
  path: ({ slug }) => `/feed/${encodeURIComponent(slug)}`,
  load: async (request, params) => {
    const dto = await request<unknown>(feedItemEndpoint.path(params))

    if (!isItemPayload(dto)) throw invalidPayload('Feed')

    const item = mapNewsDetail(dto.data)

    if (!item) throw invalidPayload('Feed')

    const related = await loadFeedRelated(request, item)

    return { item, related }
  },
}

/** Сбой связанных не роняет детальную: секция просто не выводится. */
async function loadFeedRelated(request: ApiRequest, item: NewsDetailItem): Promise<NewsCardItem[]> {
  const kind = newsRelatedKind(item.tagVariant)

  try {
    const dto = await request<unknown>('/feed', {
      query: {
        exclude: item.id,
        per_page: RELATED_LIMIT,
        ...(kind === 'news' ? {} : { type: kind }),
      },
    })

    if (!isListPayload(dto)) return []

    return mapHomeFeed(dto.data).slice(0, RELATED_LIMIT)
  } catch {
    return []
  }
}

type CatalogParams = { type: TenantCatalog }

/**
 * Весь раздел каталога одним запросом. Живой `/tenants` не пагинирует: `meta` — только `filters`,
 * `page` и `per_page` возвращают тот же список. Агрегация страниц задвоила бы карточки.
 */
export const tenantsEndpoint: ApiEndpoint<CatalogParams, CatalogListData> = {
  route: '/api/tenants',
  cache: { name: 'api-tenants', ttl: 300 },
  label: 'Tenants',
  params: ({ query }) => ({ type: readTenantCatalog(query.type) }),
  key: ({ type }) => `tenants:${type}`,
  path: ({ type }) => `/tenants?type=${encodeURIComponent(type)}`,
  load: async (request, params) => {
    const dto = await request<TenantsListResponseDto>(tenantsEndpoint.path(params))

    if (!isTenantsListResponseDto(dto)) throw invalidPayload('Tenants')

    return mapTenantsList(dto)
  },
}

function readTenantCatalog(value: unknown): TenantCatalog {
  if (typeof value !== 'string' || !isTenantCatalog(value)) {
    throw new ApiContractError(400, 'Catalog type is invalid')
  }

  return value
}

function isTenantsListResponseDto(value: unknown): value is TenantsListResponseDto {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false
  return Array.isArray(value.data)
}

/**
 * Карточка арендатора и отдельно его лента `GET /feed?tenant=`.
 * Сбой ленты не роняет карточку: блок новостей просто пустой.
 */
export const tenantEndpoint: ApiEndpoint<SlugParams, TenantDetail> = {
  route: '/api/tenants/:slug',
  cache: { name: 'api-tenant', ttl: 300 },
  label: 'Tenant',
  params: ({ slug }) => ({ slug: readSlugParam(slug, 'Tenant slug is invalid') }),
  key: ({ slug }) => `tenant:${slug}`,
  path: ({ slug }) => `/tenants/${encodeURIComponent(slug)}`,
  load: async (request, params) => {
    const [dto, news] = await Promise.all([
      request<unknown>(tenantEndpoint.path(params)),
      loadTenantNews(request, params.slug),
    ])

    if (!isItemPayload(dto)) throw invalidPayload('Tenant')

    const detail = mapTenantDetail(dto.data, news)

    if (!detail) throw invalidPayload('Tenant')

    return detail
  },
}

async function loadTenantNews(request: ApiRequest, slug: string): Promise<NewsCardItem[]> {
  try {
    const dto = await request<unknown>('/feed', { query: { tenant: slug, limit: 50 } })

    if (!isListPayload(dto)) return []

    return mapHomeFeed(dto.data)
  } catch {
    return []
  }
}

/** Пагинация Laravel: порядок ключей фиксирован, чтобы URL был предсказуем в тестах и кэше. */
function pageQuery(page: number, perPage: number): string {
  return new URLSearchParams({ page: String(page), per_page: String(perPage) }).toString()
}
