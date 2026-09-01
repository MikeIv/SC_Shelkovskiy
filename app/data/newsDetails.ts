import type { NewsCardItem, NewsDetailItem } from '#shared/types/news'
import { getNewsItemBySlug, newsCatalogBaseItems } from '~/data/newsCatalogItems'
import { normalizeNewsSlug } from '#shared/utils/newsPath'

const GIFT_CARD_GALLERY = [
  '/images/news/gift-card/gallery-1.png',
  '/images/news/gift-card.png',
  '/images/news/gift-card/gallery-1.png',
  '/images/news/gift-card.png',
  '/images/news/gift-card/gallery-1.png',
]

const CHITAI_GOROD_COVER = '/images/news/chitai-gorod/cover.png'
const CHITAI_GOROD_GALLERY = Array.from({ length: 5 }, () => CHITAI_GOROD_COVER)

const newsDetailsBySlug: Record<string, Partial<NewsDetailItem>> = {
  'chitai-gorod-gifts': {
    period: '1 августа — 2 сентября',
    gallery: CHITAI_GOROD_GALLERY,
    tenant: {
      logoSrc: '/images/news/chitai-gorod/tenant-logo.png',
      logoAlt: 'Читай-город',
      floor: '4 этаж',
      mapUrl: '/map',
    },
    intro: [
      'Для всех, кому скоро в школу! В Читай-городе подарки за покупку от 2000 руб.',
      'Акция действует с 01.08.2026 по 30.09.2026.',
      'Ассортимент на твердую пятерку!',
    ],
  },
  'kino-okko-gde-ty': {
    period: '25 июня — 31 июля',
  },
  'colins-sale': {
    period: '1 июля — 31 июля',
  },
  'mir-kubikov-sale': {
    period: '1 июля — 31 июля',
  },
  'gift-card': {
    publishedAt: '14 июля 2026',
    gallery: GIFT_CARD_GALLERY,
    tenant: {
      logoSrc: '/images/news/gift-card/tenant-logo.svg',
      logoAlt: 'ТРЦ «Щёлковский»',
      floor: '1 этаж',
      mapUrl: '/map',
    },
    intro: [
      'Дни рождения, праздники, важные даты — и каждый раз вопрос: «Что подарить, чтобы было и оригинально, и полезно?»',
      'Подарочная карта ТРЦ «Щёлковский» — универсальный подарок для любого повода!',
    ],
    sections: [
      {
        heading: 'Главные преимущества:',
        list: [
          'Действует во всех магазинах, ресторанах и развлекательных зонах «Щёлковского»',
          'Пополнение на любую сумму от 300 до 15 000 ₽',
          'Бесплатное обслуживание — без комиссий за выпуск, пополнение или транзакции',
          'Мгновенное зачисление средств после оплаты',
          'Круглосуточная поддержка держателей через службу банка',
          'Простая проверка баланса и истории операций в онлайн-кабинете',
        ],
      },
      {
        heading: 'Как это работает?',
        paragraphs: [
          'Карта оформляется бесплатно на стойке информации (1 этаж) без открытия счёта и заполнения анкет. После пополнения через онлайн-кабинет банка «Русский Стандарт», её можно сразу вручить получателю. Получатель самостоятельно выбирает, где и когда использовать средства.',
        ],
      },
      {
        quote: 'Подарочная карта ТРЦ «Щёлковский» — быстро, удобно, легко!',
      },
    ],
  },
}

function buildFallbackDetail(card: NewsCardItem, detail?: Partial<NewsDetailItem>): NewsDetailItem {
  return {
    ...card,
    ...detail,
    publishedAt: detail?.publishedAt ?? `${card.date} 2026`,
    gallery: detail?.gallery ?? (card.imageSrc ? [card.imageSrc] : []),
    intro: detail?.intro ?? [card.title],
  }
}

export function getNewsDetailBySlug(slug: string): NewsDetailItem | undefined {
  const card = getNewsItemBySlug(slug)

  if (!card) {
    return undefined
  }

  const detail = newsDetailsBySlug[normalizeNewsSlug(slug)]

  return buildFallbackDetail(card, detail)
}

export function getRelatedNewsItems(currentSlug: string, limit = 4): NewsCardItem[] {
  const normalized = normalizeNewsSlug(currentSlug)
  const current = getNewsItemBySlug(normalized)

  return newsCatalogBaseItems
    .filter((item) => {
      if (item.id === normalized) {
        return false
      }

      if (current?.tagVariant === 'action') {
        return item.tagVariant === 'action'
      }

      return true
    })
    .slice(0, limit)
}
