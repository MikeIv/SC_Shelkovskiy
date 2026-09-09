import type { HomeLoyaltyCard } from '#shared/types/home'

export const homeLoyaltyItems: HomeLoyaltyCard[] = [
  {
    id: 'loyalty-program',
    title: 'Программа лояльности',
    description: 'Станьте участником и получайте новые привилегии во время шопинга',
    variant: 'loyalty',
    illustrationSrc: '/images/home/loyalty/phones.png',
    illustrationAlt: 'Мобильное приложение программы лояльности на смартфонах',
    shadowBackSrc: '/images/home/loyalty/shadow-back.png',
    buttonLabel: 'Подробнее',
    to: '/loyalty',
  },
  {
    id: 'gift-cards',
    title: 'Подарочные карты',
    description: 'Станьте участником и получайте новые привилегии во время шопинга',
    variant: 'gift',
    illustrationAlt: 'Подарочные карты торгового центра «Щёлковский»',
    giftCardFrontSrc: '/images/home/loyalty/gift-card-front.png',
    giftCardBackSrc: '/images/home/loyalty/gift-card-back.png',
    buttonLabel: 'Купить',
  },
]
