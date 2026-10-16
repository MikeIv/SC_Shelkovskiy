import type { MapPlace } from './map'

/** Способ проезда на странице «Как добраться». */
export type DirectionsMode = 'car' | 'transit' | 'walk'

export type DirectionsTab = {
  id: DirectionsMode
  label: string
  /** Фраза для CTA маршрута, напр. «на авто». */
  routePhrase: string
  /** Параметр `rtt` для ссылки маршрута в Яндекс.Картах. */
  yandexRtt: 'auto' | 'mt' | 'pd'
}

/** Точка маршрута: та же карта, что читает каркас `UiYandexMapFrame`. */
export type DirectionsPlace = MapPlace

export type DirectionsPageContent = {
  title: string
  mapAlt: string
  place: DirectionsPlace
  tabs: DirectionsTab[]
}
