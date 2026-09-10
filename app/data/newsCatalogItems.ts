import type { NewsCardItem } from '#shared/types/news'
import { normalizeNewsSlug } from '#shared/utils/newsPath'
import { homeNewsItems } from '~/data/homeNewsItems'

/** Временные данные каталога новостей до контракта API. */
const newsCatalogBaseItems = [
  {
    id: 'gift-card',
    imageSrc: '/images/news/gift-card.png',
    imageAlt: 'Подарочная карта ТРЦ «Щёлковский»',
    date: '14 июля',
    category: 'ТРЦ «ЩЁЛКОВСКИЙ»',
    title: 'Подарочная карта ТРЦ «Щёлковский»',
    tagLabel: 'Новость',
    tagVariant: 'news',
  },
  {
    id: 'chitai-gorod-gifts',
    imageSrc: '/images/news/chitai-gorod/cover.png',
    imageAlt: 'Подарки в Читай-городе за покупку от 2000 руб.',
    date: 'до 2 сентября',
    category: 'Читай-город',
    title: 'В Читай-городе подарки за покупку от 2000 руб.',
    tagLabel: 'Акция',
    tagVariant: 'action',
  },
  {
    id: 'ekonika-autumn',
    imageSrc: '/images/home/news/ekonika.png',
    imageAlt: 'Осенняя коллекция EKONIKA PREMIUM',
    date: '14 июля',
    category: 'EKONIKA PREMIUM',
    title: 'Осенняя коллекция EKONIKA PREMIUM',
    tagLabel: 'Новость',
    tagVariant: 'news',
  },
  {
    id: 'mir-kubikov-soyuz',
    imageSrc: '/images/news/mir-kubikov-soyuz.png',
    imageAlt: 'Герои «Союзмультфильма» в эксклюзивной коллекции Brick Labs',
    date: '14 июля',
    category: 'Мир Кубиков',
    title: 'Герои «Союзмультфильма» в эксклюзивной коллекции Brick Labs в магазине «Мир Кубиков»',
    tagLabel: 'Новость',
    tagVariant: 'news',
  },
  {
    id: 'kino-okko-gde-ty',
    imageSrc: '/images/news/kino-okko.png',
    imageAlt: '«Где ты?» в кинотеатре КИНО ОККО',
    date: 'до 31 июля',
    category: 'КИНО ОККО',
    title:
      '«Где ты?»: жизнеутверждающая мелодрама с Никитой Волковым и Анной Богомоловой, в кино с 25 июня',
    tagLabel: 'Акция',
    tagVariant: 'action',
  },
  {
    id: 'mir-kubikov-sale',
    imageSrc: '/images/news/mir-kubikov-soyuz.png',
    imageAlt: 'Скидки в магазине «Мир Кубиков»',
    date: 'до 31 июля',
    category: 'Мир Кубиков',
    title: 'Еще больше товаров со скидками до 60% в магазине «Мир Кубиков»',
    tagLabel: 'Акция',
    tagVariant: 'action',
  },
  {
    id: 'colins-sale',
    imageSrc: '/images/home/news/colins.png',
    imageAlt: 'Летняя распродажа в магазине COLIN’S',
    date: '14 июля',
    category: 'COLIN’S',
    title: 'Летняя распродажа в магазине COLIN’S',
    tagLabel: 'Акция',
    tagVariant: 'action',
  },
  {
    id: 'zarina-tea-club',
    imageSrc: '/images/news/zarina.png',
    imageAlt: 'Лимитированная коллекция «Чайный клуб» в ZARINA',
    date: '14 июля',
    category: 'ZARINA',
    title: 'Лимитированная коллекция «Чайный клуб» в ZARINA',
    tagLabel: 'Новость',
    tagVariant: 'news',
  },
  {
    id: 'mir-kubikov-f1',
    imageSrc: '/images/news/mir-kubikov-f1.png',
    imageAlt: 'Новые наборы LEGO по Формуле-1 в магазине «Мир Кубиков»',
    date: '14 июля',
    category: 'Мир Кубиков',
    title: 'Новые наборы LEGO по Формуле-1 в магазине «Мир Кубиков»',
    tagLabel: 'Новость',
    tagVariant: 'news',
  },
  {
    id: 'joki-joya-birthday',
    imageSrc: '/images/home/news/joki-joya.png',
    imageAlt: 'День Рождения в Joki Joya',
    date: '14 июля',
    category: 'Joki Joya',
    title: 'День Рождения в Joki Joya!',
    tagLabel: 'Новость',
    tagVariant: 'news',
  },
] as const satisfies readonly NewsCardItem[]

/** Акции страницы арендатора (Figma 528:12233); в ленту новостей не дублируем. */
const tenantPageNewsItems = [
  {
    id: 'befree-sale',
    imageSrc: '/images/news/befree-sale.jpg',
    imageAlt: 'Распродажа в Befree до -70%',
    date: '07 июля — 03 августа',
    category: 'Befree',
    title: 'Распродажа в Befree до -70%',
    tagLabel: 'Акция',
    tagVariant: 'action',
  },
  {
    id: 'befree-selected',
    imageSrc: '/images/news/befree-selected.jpg',
    imageAlt: 'Befree −40% на избранные модели',
    date: '26 мая — 31 мая',
    category: 'Befree',
    title: 'Befree −40% на избранные модели',
    tagLabel: 'Акция',
    tagVariant: 'action',
  },
] as const satisfies readonly NewsCardItem[]

export { newsCatalogBaseItems }

const newsItemsBySlug = new Map<string, NewsCardItem>([
  ...newsCatalogBaseItems.map((item) => [item.id, item] as const),
  ...homeNewsItems
    .filter((item) => !newsCatalogBaseItems.some((catalogItem) => catalogItem.id === item.id))
    .map((item) => [item.id, item] as const),
  ...tenantPageNewsItems.map((item) => [item.id, item] as const),
])

export const newsCatalogItems: NewsCardItem[] = [
  ...newsCatalogBaseItems,
  ...newsCatalogBaseItems.map((item, index) => ({
    ...item,
    id: `${item.id}-dup-${index}`,
  })),
]

export function getNewsItemBySlug(slug: string): NewsCardItem | undefined {
  return newsItemsBySlug.get(normalizeNewsSlug(slug))
}
