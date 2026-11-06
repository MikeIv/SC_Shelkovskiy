import type { CinemaListData } from '#shared/types/cinema'
import type { AfishaPlaceScheduleResponseDto } from '#shared/types/dto/afisha'
import { asRecord, text } from '#shared/utils/apiRecord'
import { mapAfishaSchedule } from '#shared/utils/mappers/afisha'
import type { ApiEvent } from './apiEvent'

/**
 * Афиша API v3 (`https://api.afisha.ru/v3`) — расписание площадки для раздела «Кино».
 *
 * Вендор запрещает вызывать API с клиента (ключ и белый список IP — на нашей стороне),
 * поэтому клиент берёт данные только из ручки Nitro `/api/cinema`. Расписание вендор
 * обновляет раз в 10 минут и просит не запрашивать чаще раза в 30 минут — кэш ручки 1800 с.
 *
 * Сценарий вендора для нашего случая: расписание и описания берём из API, а покупку
 * отдаём его виджету — идентификаторы города и площадки нужны и там.
 */

/** Адрес API Афиши: без версии, она в пути (`/v3/...`). */
export const AFISHA_API_BASE = 'https://api.afisha.ru'

const UPSTREAM_TIMEOUT_MS = 10_000

const CREATION_TYPE_MOVIE = 'Movie'

/** Москва в списке городов; сравниваем в нижнем регистре по вхождению. */
const CITY_NAME = 'москв'

/** Кинотеатр ТРЦ — по вхождению в название площадки Афиши. */
const DEFAULT_PLACE_NAME = 'ОККО'

/** Настройки раздела из `runtimeConfig`: приватные ключи и необязательные id. */
export type AfishaSettings = {
  /** Партнёрский ключ — заголовок `X-ApiAuth-PartnerKey`, только на сервере. */
  partnerKey: string
  /** Ключ виджета — query-параметр `WidgetKey`, публичный. */
  widgetKey: string
  /** id города, если он зафиксирован настройкой; иначе ищем Москву. */
  cityId: string
  /** id площадки, если он известен; иначе ищем кинотеатр по названию. */
  placeId: string
  /** Часть названия площадки для поиска (по умолчанию `ОККО`). */
  placeName: string
}

/** Часть `runtimeConfig`, которую читает раздел (приватное + `public`). */
export type AfishaRuntimeConfig = {
  afishaPartnerKey?: unknown
  afishaCityId?: unknown
  afishaPlaceId?: unknown
  afishaPlaceName?: unknown
  public?: { afishaWidgetKey?: unknown }
}

export type AfishaFetchOptions = {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

/** Клиент Афиши: типизировать пути к чужому API нечем — тип задаёт вызывающий. */
export type AfishaRequest = <Dto>(
  path: string,
  options?: { query?: Record<string, string> },
) => Promise<Dto>

function configText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function readAfishaSettings(config: AfishaRuntimeConfig): AfishaSettings {
  return {
    partnerKey: configText(config.afishaPartnerKey),
    widgetKey: configText(config.public?.afishaWidgetKey),
    cityId: configText(config.afishaCityId),
    placeId: configText(config.afishaPlaceId),
    placeName: configText(config.afishaPlaceName) || DEFAULT_PLACE_NAME,
  }
}

/** Опции клиента; без партнёрского ключа ручка отвечает 503, а не идёт в API без авторизации. */
export function buildAfishaFetchOptions(settings: AfishaSettings): AfishaFetchOptions {
  if (!settings.partnerKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Afisha partner key is not configured',
    })
  }

  return {
    baseURL: AFISHA_API_BASE,
    timeout: UPSTREAM_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      'X-ApiAuth-PartnerKey': settings.partnerKey,
    },
  }
}

/**
 * HTTP-клиент Nitro к Афише. В лог пишется только статус: тело может содержать данные
 * партнёра, а ключ — секрет.
 */
export function createAfishaRequest(settings: AfishaSettings): AfishaRequest {
  return $fetch.create({
    ...buildAfishaFetchOptions(settings),
    onResponseError(ctx) {
      if (import.meta.dev) {
        console.error('[afishaApi]', String(ctx.request), ctx.response.status)
      }
    },
  }) as unknown as AfishaRequest
}

/** Id Москвы из справочника городов. */
export async function resolveCityId(request: AfishaRequest): Promise<string> {
  const cities = await request<unknown[]>('/v3/cities')
  const id = asRecord(cities.find((city) => matchesName(asRecord(city)?.Name, CITY_NAME)))?.Id

  if (typeof id !== 'number') {
    throw createError({ statusCode: 502, statusMessage: 'Afisha city is not found' })
  }

  return String(id)
}

/** Id кинотеатра ТРЦ среди площадок города, где идут фильмы. */
export async function resolvePlaceId(
  request: AfishaRequest,
  settings: AfishaSettings,
  cityId: string,
): Promise<string> {
  const places = await request<unknown[]>('/v3/places', {
    query: {
      CityId: cityId,
      CreationType: CREATION_TYPE_MOVIE,
      WidgetKey: settings.widgetKey,
    },
  })
  const id = asRecord(
    places.find((place) => matchesName(asRecord(place)?.Name, settings.placeName)),
  )?.Id

  if (typeof id !== 'number') {
    throw createError({ statusCode: 502, statusMessage: 'Afisha place is not found' })
  }

  return String(id)
}

/**
 * Расписание кинотеатра → карточки раздела. `cityId` / `placeId` из настроек не запрашивают
 * справочники: прод задаёт их явно, dev ищет по названию.
 */
export async function fetchAfishaCinema(
  request: AfishaRequest,
  settings: AfishaSettings,
): Promise<CinemaListData> {
  if (!settings.widgetKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Afisha widget key is not configured',
    })
  }

  const cityId = settings.cityId || (await resolveCityId(request))
  const placeId = settings.placeId || (await resolvePlaceId(request, settings, cityId))
  const schedule = await request<AfishaPlaceScheduleResponseDto>(`/v3/places/${placeId}/schedule`, {
    query: { WidgetKey: settings.widgetKey },
  })

  return mapAfishaSchedule(schedule, { cityId, placeId })
}

/**
 * Ручка целиком: настройки из `runtimeConfig`, клиент Афиши и расписание площадки.
 * Всё, что знает про Nuxt-рантайм, живёт здесь — маршрут остаётся обвязкой.
 */
export async function fetchAfishaCinemaFromEvent(event?: ApiEvent): Promise<CinemaListData> {
  const settings = readAfishaSettings(event ? useRuntimeConfig(event) : useRuntimeConfig())

  return fetchAfishaCinema(createAfishaRequest(settings), settings)
}

function matchesName(value: unknown, needle: string): boolean {
  const name = text(value).toLowerCase()

  return name !== '' && name.includes(needle.toLowerCase())
}
