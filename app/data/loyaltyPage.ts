import type {
  LoyaltyBenefit,
  LoyaltyJoinStep,
  LoyaltyLevel,
  LoyaltyPointStep,
  LoyaltyStoreLink,
} from '#shared/types/loyalty'

/** Временные данные до контракта API. */
export const loyaltyStoreLinks: LoyaltyStoreLink[] = [
  {
    id: 'app-store',
    label: 'App Store',
    href: '#',
    imageSrc: '/images/loyalty/app-store.svg',
    width: 140,
    height: 53,
  },
  {
    id: 'google-play',
    label: 'Google Play',
    href: '#',
    imageSrc: '/images/loyalty/google-play.svg',
    width: 159,
    height: 53,
  },
  {
    id: 'rustore',
    label: 'RuStore',
    href: '#',
    imageSrc: '/images/loyalty/rustore.svg',
    width: 127,
    height: 53,
  },
]

export const loyaltyHero = {
  title: 'Программа лояльности ТРЦ «Щёлковский»',
  downloadLabel: 'Скачать приложение',
  shapesSrc: '/images/loyalty/hero-shapes.svg',
  phonesSrc: '/images/loyalty/phones.webp',
  shadowSrc: '/images/loyalty/phones-shadow.webp',
} as const

export const loyaltyBenefits = {
  title: 'Регистрируй чеки и получай приятные бонусы!',
  description:
    'Благодаря мобильному приложению «Щёлковский» вы сможете обменять чеки на баллы, а баллы на привилегии программы лояльности',
} as const

export const loyaltyBenefitItems: LoyaltyBenefit[] = [
  {
    id: 'discounts',
    icon: 'local:percent',
    text: 'Получай скидки и подарки в магазинах ТРЦ «Щёлковский»',
  },
  {
    id: 'tickets',
    icon: 'local:ticket',
    text: 'Обменивай баллы на билеты мероприятий',
  },
  {
    id: 'parking',
    icon: 'local:car',
    text: 'Паркуйся бесплатно, оплачивая до 100% стоимости баллами',
  },
  {
    id: 'draws',
    icon: 'local:trophy',
    text: 'Участвуй в розыгрышах призов',
  },
]

export const loyaltyJoin = {
  title: 'Как стать участником программы?',
} as const

export const loyaltyJoinSteps: LoyaltyJoinStep[] = [
  {
    id: 'download',
    number: '01',
    title: 'Скачать мобильное приложение',
    variant: 'stores',
  },
  {
    id: 'auth',
    number: '02',
    title: 'Зарегистрироваться и авторизоваться под своим номером телефона',
    variant: 'auth',
    imageSrc: '/images/loyalty/join-auth.webp',
    imageWidth: 164,
    imageHeight: 140,
  },
  {
    id: 'profile',
    number: '03',
    title: 'Заполнить данные профиля',
    variant: 'profile',
    imageSrc: '/images/loyalty/join-phone.webp',
    imageWidth: 183,
    imageHeight: 247,
  },
]

export const loyaltyPoints = {
  title: 'Как получить баллы?',
  rulesLabel: 'Правила программы лояльности',
  rulesHref: '#',
  phonesSrc: '/images/loyalty/points-phones.webp',
  phonesAlt: 'Экраны приложения с бонусами и регистрацией чеков',
} as const

export const loyaltyPointSteps: LoyaltyPointStep[] = [
  {
    id: 'shop',
    number: '01',
    text: 'Совершай покупки в ТРЦ «Щёлковский»',
  },
  {
    id: 'register',
    number: '02',
    text: 'Регистрируй чеки в мобильном приложении «Щёлковский»',
  },
  {
    id: 'credit',
    number: '03',
    text: 'После проверки чека системой, будут начислены баллы',
  },
  {
    id: 'exchange',
    number: '04',
    text: 'Обменивай баллы на приятные бонусы',
  },
]

export const loyaltyLevels = {
  title: 'Уровни программы лояльности',
} as const

export const loyaltyLevelItems: LoyaltyLevel[] = [
  {
    id: 'novice',
    title: 'Новичок',
    description: 'Дается за регистрацию в мобильном приложении',
    imageSrc: '/images/loyalty/coin-novice.webp',
    imageAlt: 'Монета статуса «Новичок»',
    perks: ['Базовые комплименты'],
  },
  {
    id: 'silver',
    title: 'Серебро',
    description: 'При регистрации чеков на сумму от 20 000 рублей вы получите статус «Серебро»',
    imageSrc: '/images/loyalty/coin-silver.webp',
    imageAlt: 'Монета статуса «Серебро»',
    perks: [
      'Доступ к комплиментам статуса «Серебро»',
      '30 бонусных баллов за достижение статуса',
      'Доступ к уникальным акциям и закрытым распродажам',
    ],
  },
  {
    id: 'gold',
    title: 'Золото',
    description:
      'При регистрации чеков на сумму свыше 100 000 рублей он переходит на статус «Золото»',
    imageSrc: '/images/loyalty/coin-gold.webp',
    imageAlt: 'Монета статуса «Золото»',
    perks: [
      'Доступ к комплиментам статуса «Золото»',
      '100 бонусных баллов за достижение статуса',
      'Доступ к уникальным акциям и закрытым распродажам',
      'Возможность посещать мероприятия закрытого КЛУБА',
    ],
  },
]

export const loyaltyCta = {
  title: 'Скачайте приложение и станьте участником программы лояльности',
  supportText: 'Если у вас остались вопросы, напишите нам',
  supportLabel: 'Написать нам',
  supportHref: '/contacts',
  phonesSrc: '/images/loyalty/phones.webp',
  shadowSrc: '/images/loyalty/cta-shadow.webp',
} as const
