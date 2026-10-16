/** Точка на карте: подпись маркера, адрес и координаты. */
export type MapPlace = {
  title: string
  address: string
  /** Координаты [долгота, широта] — формат JS API Яндекс.Карт 3.0. */
  coordinates: [number, number]
}
