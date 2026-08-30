import type { NewsCardItem } from '#shared/types/news'

/** Временные карточки до контракта API. */
export const homeNewsItems: NewsCardItem[] = [
  {
    id: 'ekonika-autumn',
    imageSrc: '/images/home/news/ekonika.png',
    imageAlt: '',
    date: '14 июля',
    category: 'EKONIKA PREMIUM',
    title: 'Осенняя коллекция EKONIKA PREMIUM',
    tagLabel: 'Новость',
    tagVariant: 'news',
    to: '/news',
  },
  {
    id: 'colins-sale',
    imageSrc: '/images/home/news/colins.png',
    imageAlt: '',
    date: '14 июля',
    category: 'COLIN’S',
    title: 'Летняя распродажа в магазине COLIN’S',
    tagLabel: 'Акция',
    tagVariant: 'action',
    to: '/news',
  },
  {
    id: 'joki-joya-birthday',
    imageSrc: '/images/home/news/joki-joya.png',
    imageAlt: '',
    date: '14 июля',
    category: 'Joki Joya',
    title: 'День Рождения в Joki Joya!',
    tagLabel: 'Новость',
    tagVariant: 'news',
    to: '/news',
  },
  {
    id: 'befree-summer',
    imageSrc: '/images/home/news/befree.png',
    imageAlt: '',
    date: '14 июля',
    category: 'Befree',
    title: 'Лето 2026 в Befree',
    tagLabel: 'Новость',
    tagVariant: 'news',
    to: '/news',
  },
]
