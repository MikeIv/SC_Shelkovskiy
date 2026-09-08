import type { AboutFeature, AboutStat } from '#shared/types/about'

/** Временные данные до контракта API. */
export const aboutHero = {
  title: 'ТРЦ «Щёлковский»',
  description:
    'ТРЦ «Щёлковский» — современный технологичный комплекс с широким спектром услуг и развитой инфраструктурой.',
  imageSrc: '/images/about/hero.jpg',
  imageAlt: 'Ночной фасад торгово-развлекательного центра «Щёлковский»',
} as const

export const aboutLead = {
  title: 'Первый торгово-развлекательный центр г.Москвы в составе ТПУ!',
  description:
    'Наш центр стал первым крупным качественным проектом в сфере ритейла и развлечений для Восточного административного округа, где проживает более 1,5 миллиона человек.',
  watermarkSrc: '/images/about/watermark.svg',
} as const

export const aboutDesign = {
  title: 'Дизайн от мирового бюро',
  description:
    'Проект здания разработан известным международным бюро Global Architecture Development. Полупрозрачный фасад с волнообразной геометрией облицован рифлёными алюминиевыми панелями, а форма напоминает футуристический «дом-корабль».',
  videoPosterSrc: '/images/about/hero.jpg',
  videoPosterAlt: 'Фасад ТРЦ «Щёлковский» — превью видео',
} as const

export const aboutStats: AboutStat[] = [
  {
    id: 'retail-area',
    value: '60 000 м²',
    label: 'Торговая площадь для шопинга и развлечений',
  },
  {
    id: 'total-area',
    value: '157 000 м²',
    label: 'Общая площадь комплекса',
  },
  {
    id: 'glazing',
    value: '7 800 м²',
    label: 'Площадь остекления — «дом-корабль» из стекла и металла',
  },
  {
    id: 'construction',
    value: '3 года',
    label: 'Строительство с применением передовых инженерных решений',
  },
  {
    id: 'height',
    value: '35 м',
    label: 'Высота здания',
  },
  {
    id: 'parking',
    value: '1000 м/м',
    label: 'Подземная многоуровневая парковка',
  },
]

export const aboutFeaturesTitle = {
  title: 'Мы собрали лучшие бренды для всей семьи',
  description:
    'Качественный шопинг, передовые технологии и семейный досуг в самом сердце динамичного района Москвы',
} as const

export const aboutFeatures: AboutFeature[] = [
  {
    id: 'cinema',
    title: 'Кинотеатр',
    description: 'Мультиплекс «КИНООККО»',
    imageSrc: '/images/about/cinema.jpg',
    imageAlt: 'Зал мультиплекса «КИНООККО»',
    stats: [
      { value: '3 600 м²', label: 'площадь' },
      { value: '8', label: 'залов' },
      { value: '930', label: 'мест' },
    ],
  },
  {
    id: 'sport',
    title: 'Спорт',
    description:
      'Фитнес-клуб World Class с 25-метровым бассейном и двумя залами групповых программ.',
    imageSrc: '/images/about/sport.jpg',
    imageAlt: 'Тренажёрный зал World Class',
    stats: [{ value: '3 200 м²', label: 'площадь' }],
  },
  {
    id: 'kids',
    title: 'Детский досуг',
    description:
      'Семейный парк Joki Joya — многоэтажные лабиринты, скалодром, тарзанки, батуты и «сказочные пещеры».',
    imageSrc: '/images/about/kids.jpg',
    imageAlt: 'Семейный парк Joki Joya',
    stats: [{ value: '2 300 м²', label: 'площадь' }],
  },
  {
    id: 'shops',
    title: 'Магазины',
    description:
      'Супермаркет «Перекрёсток», DNS, Haier, хобби-гипермаркет «Леонардо», «Снежная Королева», «Читай-город», Askona, РИВ ГОШ, ЛЭТУАЛЬ и десятки других брендов одежды и обуви.',
    imageSrc: '/images/about/shops.jpg',
    imageAlt: 'Торговая галерея ТРЦ «Щёлковский»',
  },
  {
    id: 'services',
    title: 'Услуги',
    description: 'Флагманский центр «Мои документы» (МФЦ) на территории ТРЦ.',
    imageSrc: '/images/about/services.jpg',
    imageAlt: 'Центр «Мои документы» в ТРЦ',
  },
]
