import type { DirectionsPageContent } from '#shared/types/directions'

/** Временные данные до контракта API. */
export const directionsPage = {
  title: 'Как добраться',
  mapAlt: 'Карта проезда к ТРЦ «Щёлковский»',
  place: {
    title: 'ТРЦ «Щёлковский»',
    address: 'Москва, Щёлковское шоссе, 75',
    /** [lng, lat] — ориентир по адресу Щёлковское шоссе, 75. */
    coordinates: [37.79985, 55.81144],
  },
  tabs: [
    {
      id: 'car',
      label: 'На авто',
      routePhrase: 'на авто',
      yandexRtt: 'auto',
    },
    {
      id: 'transit',
      label: 'На общественном транспорте',
      routePhrase: 'на общественном транспорте',
      yandexRtt: 'mt',
    },
    {
      id: 'walk',
      label: 'Пешком',
      routePhrase: 'пешком',
      yandexRtt: 'pd',
    },
  ],
} as const satisfies DirectionsPageContent
