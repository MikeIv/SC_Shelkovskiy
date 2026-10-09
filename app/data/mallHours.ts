/** Арендаторы панели часов, пока `hours.tenants` со стенда пуст. */
export const mallHoursTenants = [
  {
    name: 'Перекресток',
    ranges: [{ label: 'Пн-Вс', open: '07:00', close: '23:00' }],
  },
  {
    name: 'КиноОККО',
    ranges: [{ label: 'Пн-Вс', open: '10:00', close: '02:00' }],
  },
  {
    name: 'Аптека Доктор Столетов',
    ranges: [{ label: 'Пн-Вс', open: '09:00', close: '23:00' }],
  },
  {
    name: 'World class',
    ranges: [
      { label: 'Пн-Пт', open: '07:00', close: '00:00' },
      { label: 'Сб-Вс', open: '09:00', close: '00:00' },
    ],
  },
] as const

/** Расписание ТРЦ до контракта API. Пн…Вс в порядке отображения панели. */
export const mallOpenHours = [
  { label: 'Пн', open: '10:00', close: '22:00' },
  { label: 'Вт', open: '10:00', close: '22:00' },
  { label: 'Ср', open: '10:00', close: '22:00' },
  { label: 'Чт', open: '10:00', close: '22:00' },
  { label: 'Пт', open: '10:00', close: '23:00' },
  { label: 'Сб', open: '10:00', close: '23:00' },
  { label: 'Вс', open: '10:00', close: '22:00' },
] as const
