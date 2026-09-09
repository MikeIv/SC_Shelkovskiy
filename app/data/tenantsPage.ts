import type { TenantsAdvantage, TenantsStat, TenantsTradeProfile } from '#shared/types/tenants'

/** Временные данные до контракта API. */
export const tenantsHero = {
  title: 'Арендаторам ТРЦ «Щёлковский»',
  description:
    'ТРЦ «Щёлковский» – это не просто торговый центр, а первый современный многофункциональный комплекс в Восточном административном округе, закрывающий многолетний дефицит качественных площадей для ритейла и досуга.',
  imageSrc: '/images/tenants/hero.jpg',
  imageAlt: 'Ночной фасад торгово-развлекательного центра «Щёлковский»',
  ctaLabel: 'Войти в личный кабинет',
  ctaTo: '/tenant',
} as const

export const tenantsStats = {
  title: 'Цифры, которые говорят сами за себя',
  description:
    'Мы предлагаем арендаторам уникальную возможность стать частью востребованного пространства с гарантированным трафиком и высокой покупательской способностью аудитории.',
  watermarkSrc: '/images/tenants/watermark.svg',
} as const

export const tenantsStatItems: TenantsStat[] = [
  {
    id: 'total-area',
    value: '157 000 м²',
    label: 'Общая площадь комплекса',
  },
  {
    id: 'retail-area',
    value: '60 000 м²',
    label: 'Торговая площадь',
  },
  {
    id: 'audience',
    value: '>1,5 млн человек',
    label: 'Население в радиусе 5–10 км',
  },
]

export const tenantsAdvantages = {
  title: 'Ключевые преимущества для бизнеса',
} as const

export const tenantsAdvantageItems: TenantsAdvantage[] = [
  {
    id: 'location',
    title: 'Идеальная локация и транспортная доступность',
    imageSrc: '/images/tenants/advantages.jpg',
    imageAlt: 'Фасад ТРЦ «Щёлковский» ночью',
    points: [
      'Встроен в структуру Транспортно-пересадочного узла «Щёлковский» – естественный перехват потоков пассажиров (метро, МЦД, автобусы)',
      'Расположен в густонаселённом ВАО – второй округ Москвы по численности жителей, которые ранее были лишены современных торговых центров',
      'Близость к Щёлковскому шоссе и основным магистралям обеспечивает удобный подъезд для автомобилистов',
    ],
  },
  {
    id: 'anchors',
    title: 'Мощные якоря – гарантия трафика',
    imageSrc: '/images/about/shops.jpg',
    imageAlt: 'Торговая галерея ТРЦ «Щёлковский»',
    points: [
      'Якорные операторы и мультиплекс формируют регулярный поток посетителей в течение всего дня',
      'Сильный микс fashion, food и entertainment удерживает гостей в центре дольше',
      'Инфраструктура ТПУ усиливает ежедневный трафик в будни и выходные',
    ],
  },
  {
    id: 'audience',
    title: 'Целевая аудитория с высоким потенциалом',
    imageSrc: '/images/about/hero.jpg',
    imageAlt: 'ТРЦ «Щёлковский» — современный комплекс для жителей ВАО',
    points: [
      'Более 1,5 млн жителей в радиусе 5–10 км с дефицитом качественного ритейла',
      'Семейная аудитория ВАО с высоким спросом на шопинг, досуг и сервисы',
      'Удобная транспортная доступность расширяет зону охвата за пределы округа',
    ],
  },
  {
    id: 'leisure',
    title: 'Гастрономия и развлечения – создаём полный цикл досуга',
    imageSrc: '/images/about/cinema.jpg',
    imageAlt: 'Зона развлечений и досуга в ТРЦ «Щёлковский»',
    points: [
      'Фуд-корт, рестораны и кафе поддерживают длительное пребывание гостей',
      'Кино, спорт и детский досуг увеличивают частоту визитов всей семьи',
      'Комплексный досуговый сценарий повышает конверсию торговых операторов',
    ],
  },
]

export const tenantsApply = {
  title: 'Присоединяйтесь к Щёлковскому',
  privacyHref: '/privacy',
  presentationLabel: 'Скачать презентацию',
  presentationHref: '#',
  presentationNote: 'Вы можете скачать нашу презентацию и ознакомиться с нашим ТЦ подробнее',
  contactsTitle: 'Контакты для связи',
  contactsDecorSrc: '/images/tenants/contacts-decor.svg',
  phoneLabel: 'Телефон',
  phoneDisplay: '+7 (499) 677-88-88',
  phoneExt: 'добавочные: 5151, 4779, 5181',
  phoneHref: 'tel:+74996778888',
  emailLabel: 'Почта',
  email: 'arenda@schelkovsky-trc.ru',
  emailHref: 'mailto:arenda@schelkovsky-trc.ru',
} as const

export const tenantsTradeProfiles: TenantsTradeProfile[] = [
  { id: 'shop', label: 'Магазин' },
  { id: 'cafe', label: 'Ресторан/Кафе' },
  { id: 'entertainment', label: 'Развлечения/Услуги' },
]
