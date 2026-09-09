/** Режим схемы на странице `/map`. */
export type SchemeMode = 'mall' | 'parking'

/** Точка полигона в координатном пространстве этажа (viewBox). */
export type SchemePoint = {
  x: number
  y: number
}

/** Статус помещения на схеме. */
export type SchemeUnitStatus = 'open' | 'coming-soon'

/**
 * Помещение / арендатор на схеме.
 * Координаты и площадь — контракт под будущий API JSON.
 */
export type SchemeUnit = {
  id: string
  name: string
  /** Площадь, м². */
  areaSqm: number
  /** Замкнутый полигон в системе координат этажа (`width`×`height`). */
  coordinates: SchemePoint[]
  status?: SchemeUnitStatus
  logoSrc?: string
}

/** Тип удобства на схеме. */
export type SchemeAmenityKind = 'toilet' | 'mother-child' | 'cloakroom' | 'atm' | 'parking'

/** Маркер удобства на схеме. */
export type SchemeAmenityMarker = {
  id: string
  kind: SchemeAmenityKind
  x: number
  y: number
}

/** Схема одного этажа (мок / будущий ответ API). */
export type SchemeFloorPlan = {
  id: string
  label: string
  /** Ширина координатного пространства (viewBox). */
  width: number
  /** Высота координатного пространства (viewBox). */
  height: number
  /** Подложка схемы; без файла — только SVG-полигоны. */
  backgroundSrc?: string
  backgroundAlt?: string
  units: SchemeUnit[]
  amenities: SchemeAmenityMarker[]
}

/** Пункт фильтра удобств под картой. */
export type SchemeAmenityFilter = {
  id: SchemeAmenityKind
  label: string
  icon: string
}

/** Контент страницы «Схема» до контракта API. */
export type SchemePageContent = {
  title: string
  searchPlaceholder: string
  modes: Array<{ id: SchemeMode; label: string }>
  amenities: SchemeAmenityFilter[]
  mallFloors: SchemeFloorPlan[]
  parkingFloors: SchemeFloorPlan[]
  defaultMallFloorId: string
  defaultParkingFloorId: string
}
