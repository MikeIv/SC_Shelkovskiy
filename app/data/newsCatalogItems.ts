import type { NewsCardItem } from '#shared/types/news'
import { normalizeNewsSlug } from '#shared/utils/newsPath'
import { homeNewsItems } from '~/data/homeNewsItems'

/** Временные данные каталога новостей до контракта API. */
const newsCatalogBaseItems = [
  {
    id: 'gift-card',
    imageSrc: '/images/news/gift-card.jpg',
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
    imageSrc: '/images/home/news/ekonika.jpg',
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
    imageSrc: '/images/home/news/colins.jpg',
    imageAlt: 'Летняя распродажа в магазине COLIN’S',
    date: '14 июля',
    category: 'COLIN’S',
    title: 'Летняя распродажа в магазине COLIN’S',
    tagLabel: 'Акция',
    tagVariant: 'action',
  },
  {
    id: 'zarina-tea-club',
    imageSrc: '/images/news/zarina.jpg',
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
    imageSrc: '/images/home/news/joki-joya.jpg',
    imageAlt: 'День Рождения в Joki Joya',
    date: '14 июля',
    category: 'Joki Joya',
    title: 'День Рождения в Joki Joya!',
    tagLabel: 'Новость',
    tagVariant: 'news',
  },
  {
    id: 'rbc-public-spaces',
    imageSrc: '/images/layout/menu-mall.jpg',
    imageAlt: 'ТРЦ «Щёлковский»',
    date: '14 июля',
    category: 'РБК',
    title: 'ТРЦ «Щёлковский» обновил общественные пространства и галерею',
    tagLabel: 'СМИ о нас',
    tagVariant: 'smi',
  },
  {
    id: 'moskva24-weekend',
    imageSrc: '/images/layout/menu/entertainment.jpg',
    imageAlt: 'Развлечения в ТРЦ «Щёлковский»',
    date: '8 июля',
    category: 'Москва 24',
    title: 'Куда сходить на выходных: гид по ТРЦ «Щёлковский»',
    tagLabel: 'СМИ о нас',
    tagVariant: 'smi',
  },
  {
    id: 'afisha-food-court',
    imageSrc: '/images/layout/menu/cafes.jpg',
    imageAlt: 'Кафе и рестораны ТРЦ «Щёлковский»',
    date: '2 июля',
    category: 'Афиша Daily',
    title: 'Новые рестораны и кафе на фуд-корте ТРЦ «Щёлковский»',
    tagLabel: 'СМИ о нас',
    tagVariant: 'smi',
  },
  {
    id: 'vedomosti-parking',
    imageSrc: '/images/layout/menu/services.jpg',
    imageAlt: 'Сервисы для гостей ТРЦ «Щёлковский»',
    date: '24 июня',
    category: 'Ведомости',
    title: 'ТРЦ «Щёлковский» расширил парковку и сервисы для гостей',
    tagLabel: 'СМИ о нас',
    tagVariant: 'smi',
  },
  {
    id: 'city-family-weekend',
    imageSrc: '/images/layout/menu/events.jpg',
    imageAlt: 'Семейные мероприятия в ТРЦ «Щёлковский»',
    date: '18 июня',
    category: 'The City',
    title: 'Семейный уикенд: развлечения для детей в ТРЦ «Щёлковский»',
    tagLabel: 'СМИ о нас',
    tagVariant: 'smi',
  },
  {
    id: 'interfax-loyalty',
    imageSrc: '/images/news/gift-card.jpg',
    imageAlt: 'Программа лояльности ТРЦ «Щёлковский»',
    date: '10 июня',
    category: 'Интерфакс',
    title: 'ТРЦ «Щёлковский» запустил программу лояльности для постоянных гостей',
    tagLabel: 'СМИ о нас',
    tagVariant: 'smi',
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

export const newsCatalogItems: NewsCardItem[] = [...newsCatalogBaseItems]

export function getNewsItemBySlug(slug: string): NewsCardItem | undefined {
  return newsItemsBySlug.get(normalizeNewsSlug(slug))
}
