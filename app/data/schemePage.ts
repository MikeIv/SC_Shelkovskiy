import type {
  SchemeAmenityFilter,
  SchemeFloorPlan,
  SchemePageContent,
  SchemePoint,
  SchemeUnit,
} from '#shared/types/scheme'

/** Общее координатное пространство схем (как кадр 1560×600). */
const MAP_W = 1560
const MAP_H = 600

function rect(x: number, y: number, w: number, h: number): SchemePoint[] {
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
  ]
}

function unit(
  id: string,
  name: string,
  areaSqm: number,
  coordinates: SchemePoint[],
  status: SchemeUnit['status'] = 'open',
): SchemeUnit {
  return { id, name, areaSqm, coordinates, status }
}

const amenityFilters: SchemeAmenityFilter[] = [
  { id: 'toilet', label: 'Туалет', icon: 'local:toilet' },
  {
    id: 'mother-child',
    label: 'Комната матери и ребенка',
    icon: 'local:mother-child',
  },
  { id: 'cloakroom', label: 'Гардероб', icon: 'local:cloakroom' },
  { id: 'atm', label: 'Банкоматы', icon: 'local:atm' },
  { id: 'parking', label: 'Парковки', icon: 'local:parking' },
]

/** 2 этаж — подложка из макета + полигоны поверх. */
const floor2: SchemeFloorPlan = {
  id: '2',
  label: '2',
  width: MAP_W,
  height: MAP_H,
  backgroundSrc: '/images/scheme/floor-2.webp',
  backgroundAlt: 'Схема 2 этажа ТРЦ «Щёлковский»',
  units: [
    unit('befree', 'Befree', 420, rect(120, 90, 210, 140)),
    unit('love-republic', 'LOVE REPUBLIC', 380, rect(350, 90, 200, 140)),
    unit('zarina', 'ZARINA', 360, rect(570, 90, 190, 140)),
    unit('soon-2a', 'Скоро открытие', 180, rect(780, 90, 120, 140), 'coming-soon'),
    unit('mango', 'MANGO', 510, rect(120, 320, 260, 180)),
    unit('gloria-jeans', 'Gloria Jeans', 290, rect(420, 340, 180, 150)),
    unit('syrovarnya', 'Сыроварня', 160, rect(640, 360, 140, 120)),
    unit('maag', 'MAAG', 980, rect(980, 120, 420, 380)),
  ],
  amenities: [
    { id: 'f2-toilet-1', kind: 'toilet', x: 900, y: 280 },
    { id: 'f2-mc-1', kind: 'mother-child', x: 860, y: 420 },
    { id: 'f2-cloak-1', kind: 'cloakroom', x: 200, y: 520 },
    { id: 'f2-atm-1', kind: 'atm', x: 760, y: 280 },
    { id: 'f2-park-1', kind: 'parking', x: 1480, y: 80 },
  ],
}

const floor1: SchemeFloorPlan = {
  id: '1',
  label: '1',
  width: MAP_W,
  height: MAP_H,
  backgroundAlt: 'Схема 1 этажа ТРЦ «Щёлковский»',
  units: [
    unit('adidas', 'adidas', 640, rect(80, 80, 320, 220)),
    unit('nike', 'Nike', 480, rect(440, 80, 260, 200)),
    unit('ekonika', 'Эконика', 220, rect(740, 100, 160, 160)),
    unit('soon-1a', 'Скоро открытие', 140, rect(940, 120, 120, 140), 'coming-soon'),
    unit('colins', 'COLIN’S', 520, rect(80, 340, 280, 180)),
    unit('zolotoy', 'Золотой', 300, rect(400, 360, 200, 140)),
    unit('mfc', 'МФЦ', 420, rect(1080, 100, 360, 400)),
  ],
  amenities: [
    { id: 'f1-toilet-1', kind: 'toilet', x: 920, y: 300 },
    { id: 'f1-atm-1', kind: 'atm', x: 700, y: 320 },
    { id: 'f1-cloak-1', kind: 'cloakroom', x: 180, y: 300 },
    { id: 'f1-park-1', kind: 'parking', x: 1480, y: 520 },
  ],
}

const floor0: SchemeFloorPlan = {
  id: '0',
  label: '0',
  width: MAP_W,
  height: MAP_H,
  backgroundAlt: 'Схема 0 этажа ТРЦ «Щёлковский»',
  units: [
    unit('info', 'Стойка информации', 90, rect(700, 240, 160, 100)),
    unit('food-court', 'Фуд-корт', 1100, rect(80, 80, 560, 440)),
    unit('cinnabon', 'Cinnabon', 180, rect(700, 80, 160, 120)),
    unit('coffeevan', 'Coffee Van', 160, rect(900, 80, 150, 120)),
    unit('parking-entry', 'Вход с парковки', 240, rect(1200, 300, 240, 200)),
  ],
  amenities: [
    { id: 'f0-toilet-1', kind: 'toilet', x: 640, y: 480 },
    { id: 'f0-mc-1', kind: 'mother-child', x: 600, y: 120 },
    { id: 'f0-park-1', kind: 'parking', x: 1480, y: 400 },
  ],
}

const floor3: SchemeFloorPlan = {
  id: '3',
  label: '3',
  width: MAP_W,
  height: MAP_H,
  backgroundAlt: 'Схема 3 этажа ТРЦ «Щёлковский»',
  units: [
    unit('world-class', 'World Class', 1400, rect(80, 80, 700, 440)),
    unit('spa', 'SPA', 320, rect(840, 100, 240, 200)),
    unit('soon-3a', 'Скоро открытие', 200, rect(1120, 120, 160, 160), 'coming-soon'),
    unit('cafe-fit', 'Fit Café', 180, rect(840, 360, 200, 140)),
  ],
  amenities: [
    { id: 'f3-toilet-1', kind: 'toilet', x: 780, y: 300 },
    { id: 'f3-cloak-1', kind: 'cloakroom', x: 120, y: 480 },
    { id: 'f3-atm-1', kind: 'atm', x: 1100, y: 360 },
  ],
}

const floor4: SchemeFloorPlan = {
  id: '4',
  label: '4',
  width: MAP_W,
  height: MAP_H,
  backgroundAlt: 'Схема 4 этажа ТРЦ «Щёлковский»',
  units: [
    unit('kino-okko', 'КИНО OKKO', 1600, rect(200, 80, 900, 440)),
    unit('popcorn', 'Попкорн-бар', 160, rect(1160, 120, 160, 140)),
    unit('soon-4a', 'Скоро открытие', 180, rect(1160, 320, 160, 160), 'coming-soon'),
  ],
  amenities: [
    { id: 'f4-toilet-1', kind: 'toilet', x: 140, y: 300 },
    { id: 'f4-atm-1', kind: 'atm', x: 140, y: 420 },
  ],
}

const floor5: SchemeFloorPlan = {
  id: '5',
  label: '5',
  width: MAP_W,
  height: MAP_H,
  backgroundAlt: 'Схема 5 этажа ТРЦ «Щёлковский»',
  units: [
    unit('joki-joya', 'Joki Joya', 900, rect(80, 80, 520, 440)),
    unit('kids-train', 'Детский паровозик', 260, rect(660, 120, 220, 180)),
    unit('photo', 'Фотобудка', 120, rect(660, 360, 160, 120)),
    unit('soon-5a', 'Скоро открытие', 280, rect(960, 160, 240, 280), 'coming-soon'),
  ],
  amenities: [
    { id: 'f5-toilet-1', kind: 'toilet', x: 920, y: 120 },
    { id: 'f5-mc-1', kind: 'mother-child', x: 900, y: 480 },
  ],
}

const floor6: SchemeFloorPlan = {
  id: '6',
  label: '6',
  width: MAP_W,
  height: MAP_H,
  backgroundAlt: 'Схема 6 этажа ТРЦ «Щёлковский»',
  units: [
    unit('events-hall', 'Зал мероприятий', 1200, rect(160, 100, 800, 400)),
    unit('vip', 'VIP-зона', 220, rect(1040, 140, 200, 160)),
    unit('tech', 'Тех. помещения', 180, rect(1040, 360, 200, 120), 'coming-soon'),
  ],
  amenities: [
    { id: 'f6-toilet-1', kind: 'toilet', x: 120, y: 300 },
    { id: 'f6-cloak-1', kind: 'cloakroom', x: 120, y: 420 },
  ],
}

/** Парковка: разные зоны по этажам (мок). */
function parkingFloor(
  id: string,
  label: string,
  zones: Array<[string, string, number, number, number, number, number]>,
): SchemeFloorPlan {
  return {
    id,
    label,
    width: MAP_W,
    height: MAP_H,
    backgroundSrc: '/images/parking/map.webp',
    backgroundAlt: `Схема парковки, этаж ${label}`,
    units: zones.map(([uid, name, area, x, y, w, h]) => unit(uid, name, area, rect(x, y, w, h))),
    amenities: [
      { id: `${id}-park`, kind: 'parking', x: 1400, y: 80 },
      { id: `${id}-atm`, kind: 'atm', x: 200, y: 80 },
    ],
  }
}

/**
 * Временные данные схемы до контракта API.
 * При подключении — заменить загрузкой через `useApi` / `useApiFetch`.
 */
export const schemePage: SchemePageContent = {
  title: 'Схема',
  searchPlaceholder: 'Найти магазин',
  modes: [
    { id: 'mall', label: 'Схема ТРЦ' },
    { id: 'parking', label: 'Схема парковки' },
  ],
  amenities: amenityFilters,
  mallFloors: [floor6, floor5, floor4, floor3, floor2, floor1, floor0],
  parkingFloors: [
    parkingFloor('-2', '-2', [
      ['p-2-a', 'Зона A', 2400, 80, 80, 500, 440],
      ['p-2-b', 'Зона B', 2100, 640, 80, 480, 440],
      ['p-2-c', 'Зона C', 1800, 1180, 120, 280, 360],
    ]),
    parkingFloor('-3', '-3', [
      ['p-3-a', 'Зона A', 2600, 100, 100, 560, 400],
      ['p-3-b', 'Зона B', 2000, 720, 100, 420, 400],
      ['p-3-moto', 'Мото', 400, 1200, 160, 240, 280],
    ]),
    parkingFloor('-4', '-4', [
      ['p-4-a', 'Зона A', 2800, 80, 120, 700, 360],
      ['p-4-b', 'Зона B', 1900, 840, 120, 500, 360],
      ['p-4-service', 'Сервис', 320, 1200, 200, 240, 200],
    ]),
  ],
  defaultMallFloorId: '2',
  defaultParkingFloorId: '-4',
}

/** Плоский список арендаторов для поиска (все этажи ТРЦ). */
export function flattenSchemeUnits(
  floors: SchemeFloorPlan[],
): Array<{ floorId: string; unit: SchemeUnit }> {
  return floors.flatMap((floor) =>
    floor.units.map((unitItem) => ({ floorId: floor.id, unit: unitItem })),
  )
}
