import type { HomeCinemaFilm } from '#shared/types/home'

/**
 * Ответ `/api/cinema`: фильмы, которые идут в кинотеатре ТРЦ, и идентификаторы Афиши,
 * без которых не открыть её виджет покупки (`cityId` / `placeId` в параметрах SDK).
 */
export type CinemaListData = {
  /** id города Афиши — `cityId` виджета. */
  cityId: string | null
  /** id площадки Афиши — фильтр расписания в виджете (`placeId`). */
  placeId: string | null
  items: HomeCinemaFilm[]
}
