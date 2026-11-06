import type { CinemaListData } from '#shared/types/cinema'
import type { AfishaPlaceScheduleResponseDto } from '#shared/types/dto/afisha'
import { mapAfishaSchedule } from '#shared/utils/mappers/afisha'
import type { ApiEvent } from './apiEvent'

/**
 * Кино на главной: расписание кинотеатра ТРЦ из Афиши.
 *
 * Данные берём из внутреннего API её виджета (`https://mapi.afisha.ru/api/v21`) — тем же
 * запросом, которым живёт iframe. Партнёрский ключ и белый список IP не нужны: заголовок
 * `X-Application-key` содержит публичный ключ виджета. Документированный API v3
 * (`api.afisha.ru/v3`) отдаёт то же самое, но закрыт белым списком IP, поэтому его
 * используем, только если понадобится официальный контракт.
 */
export const AFISHA_WIDGET_API_BASE = 'https://mapi.afisha.ru/api/v21'

const UPSTREAM_TIMEOUT_MS = 10_000

/** По умолчанию площадка отдаёт три фильма: размер страницы задаёт `limit`. */
const SCHEDULE_LIMIT = 24

/** Настройки раздела: всё публичное — ключ виджета и id площадки из `runtimeConfig`. */
export type AfishaSettings = {
  /** Публичный ключ виджета Афиши — заголовок `X-Application-key`. */
  widgetKey: string
  /** Площадка Афиши — кинотеатр ТРЦ (`afishaWidgetPlaceId`). */
  placeId: string
  /** Город площадки (`afishaWidgetCityId`): модальный виджет покупки собирает путь с ним. */
  cityId: string
}

/** Часть `runtimeConfig`, которую читает раздел. */
export type AfishaRuntimeConfig = {
  public?: {
    afishaWidgetKey?: unknown
    afishaWidgetPlaceId?: unknown
    afishaWidgetCityId?: unknown
  }
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
    widgetKey: configText(config.public?.afishaWidgetKey),
    placeId: configText(config.public?.afishaWidgetPlaceId),
    cityId: configText(config.public?.afishaWidgetCityId),
  }
}

/** Опции клиента; без ключа виджета ручка отвечает 503, а не идёт в API без авторизации. */
export function buildAfishaFetchOptions(settings: AfishaSettings): AfishaFetchOptions {
  if (!settings.widgetKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Afisha widget key is not configured',
    })
  }

  return {
    baseURL: AFISHA_WIDGET_API_BASE,
    timeout: UPSTREAM_TIMEOUT_MS,
    headers: {
      Accept: 'application/json',
      'X-Application-key': settings.widgetKey,
    },
  }
}

/**
 * HTTP-клиент Nitro к Афише. В лог пишется только статус: ответ может быть большим,
 * а ключ виджета — единственное, что мы передаём наверх.
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

/** Расписание кинотеатра → карточки раздела. */
export async function fetchAfishaCinema(
  request: AfishaRequest,
  settings: AfishaSettings,
): Promise<CinemaListData> {
  if (!settings.placeId) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Afisha place id is not configured',
    })
  }

  const schedule = await request<AfishaPlaceScheduleResponseDto>(
    `/places/${settings.placeId}/schedule`,
    { query: { limit: String(SCHEDULE_LIMIT) } },
  )

  return mapAfishaSchedule(schedule.creationSchedules ?? [], {
    cityId: settings.cityId,
    placeId: settings.placeId,
  })
}

/**
 * Ручка целиком: настройки из `runtimeConfig`, клиент Афиши и расписание площадки.
 * Всё, что знает про Nuxt-рантайм, живёт здесь — маршрут остаётся обвязкой.
 */
export async function fetchAfishaCinemaFromEvent(event?: ApiEvent): Promise<CinemaListData> {
  const settings = readAfishaSettings(event ? useRuntimeConfig(event) : useRuntimeConfig())

  return fetchAfishaCinema(createAfishaRequest(settings), settings)
}
