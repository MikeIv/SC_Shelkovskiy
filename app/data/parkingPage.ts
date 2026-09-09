import type {
  ParkingBenefitBlock,
  ParkingFloor,
  ParkingPass,
  ParkingSpecialBlock,
  ParkingTariff,
} from '#shared/types/parking'

/** Временные данные до контракта API. */
export const parkingInfo = {
  title: 'Парковка',
  description:
    'Въезд и выезд на территорию подземного многоуровневого паркинга торгово-развлекательного центра «Щёлковский» осуществляется только по парковочным картам* по следующим тарифам:',
  notes:
    '* Штраф за утерю парковочной карты 500 рублей.\n** Первые 15 минут бесплатно (на посадку/высадку пассажиров), но если Вы находитесь в ТРЦ большее количество времени, то отсчёт времени паркинга начинается с времени заезда.',
  rulesLabel: 'Правила парковки',
  rulesHref: '#',
  imageSrc: '/images/parking/hero.jpg',
  imageAlt: 'Подземная парковка ТРЦ «Щёлковский»',
  mapSrc: '/images/parking/map.webp',
  mapAlt: 'Схема этажа подземной парковки',
} as const

export const parkingTariffs: ParkingTariff[] = [
  {
    id: 'first-two-hours',
    label: 'Первые 2 часа**',
    price: '100 руб.',
  },
  {
    id: 'each-next-hour',
    label: '3-й и каждый последующий',
    price: '100 руб./час',
  },
]

export const parkingFloors: ParkingFloor[] = [
  { id: '-2', label: '-2' },
  { id: '-3', label: '-3' },
  { id: '-4', label: '-4' },
]

export const parkingPassSection = {
  title: 'Абонемент на парковку в ТРЦ Щёлковский',
  description:
    'С 01 февраля 2026 года можно приобрести абонемент на подземную парковку в ТРЦ Щёлковский для автомобилей и мотоциклов на новых условиях.',
  contact:
    'Для приобретения абонемента обращайтесь на стойку информации на 1 этаже или по телефону',
  phone: '+7 (495) 677-44-44',
  phoneHref: 'tel:+74956774444',
} as const

export const parkingPasses: ParkingPass[] = [
  {
    id: 'motorcycle',
    label: 'Мотоциклы',
    price: '8 000',
    unit: 'руб./месяц',
    imageSrc: '/images/parking/motorcycle.webp',
    imageAlt: 'Мотоцикл',
  },
  {
    id: 'car',
    label: 'Автомобили',
    price: '15 000',
    unit: 'руб./месяц',
    imageSrc: '/images/parking/car.webp',
    imageAlt: 'Автомобиль',
  },
]

export const parkingBenefitGroups = [
  {
    id: 'large-family',
    title: 'Для многодетной семьи',
    rates: [
      { label: 'Первые 3 ч', value: 'Бесплатно' },
      { label: '4-й и каждый последующий', value: '100 руб./час' },
    ],
    note: 'Валидация (обнуление) парковочного талона производится на стойке информации при предъявлении соответствующего документа.',
  },
  {
    id: 'veterans',
    title: 'Для ветеранов ВОВ и инвалидов',
    rates: [
      {
        label: 'В часы работы ТРЦ «Щёлковский»',
        value: 'Бесплатно',
      },
    ],
    note: 'Валидация (обнуление) парковочного талона производится при предъявлении соответствующего документа при выезде с парковки.',
  },
] as const satisfies readonly ParkingBenefitBlock[]

export const parkingSpecial: ParkingSpecialBlock = {
  id: 'special',
  title: 'Специальные условия',
  description:
    'Для посетителей МФЦ «МОИ ДОКУМЕНТЫ», которые ставят транспортное средство на учёт, фитнес-клуба World Class, КИНООККО, автомойки 13 Detailing и детского клуба Joki Joya, действуют специальные условия:',
  rates: [
    { label: 'Первые 3 ч', value: 'Бесплатно' },
    { label: '4-й и каждый последующий', value: '100 руб./час' },
  ],
  notes: [
    'Валидация (обнуление) парковочного талона производится непосредственно в World Class, КИНООККО, 13 Detailing, Joki Joya.',
    'Валидация (обнуление) парковочного талона для посетителей МФЦ «МОИ ДОКУМЕНТЫ», которые ставят транспортное средство на учёт, производится на стойке информации на 1 этаже.',
  ],
}
