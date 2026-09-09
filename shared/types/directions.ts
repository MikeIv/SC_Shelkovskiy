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

export type DirectionsPlace = {
  title: string
  address: string
  /** Координаты [долгота, широта] — формат JS API Яндекс.Карт 3.0. */
  coordinates: [number, number]
}

export type DirectionsPageContent = {
  title: string
  mapAlt: string
  place: DirectionsPlace
  tabs: DirectionsTab[]
}
