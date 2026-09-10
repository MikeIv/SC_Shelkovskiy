import type {
  EventAfishaDate,
  EventAfishaItem,
  EventDetailItem,
  EventRegisterPopup,
} from '#shared/types/events'
import { getEventItemById } from '~/data/eventsItems'

/** Попап по кнопке «Зарегистрироваться» (Figma 3056:36187). */
export const eventsRegisterPopup = {
  title: 'Узнай первым',
  description: 'Скидки, тренды, новые коллекции',
  ctaLabel: 'Подписаться на MAX',
  ctaHref: 'https://max.ru',
  imageSrc: '/images/events/subscribe-max.webp',
  imageAlt: 'Подписывайся на MAX',
} as const satisfies EventRegisterPopup

function formatEventWhen(start: EventAfishaDate, end?: EventAfishaDate): string {
  if (!end) {
    return `${start.day} ${start.month}`
  }

  return `${start.day} ${start.month} — ${end.day} ${end.month}`
}

const eventsDetailsBySlug: Record<string, Partial<EventDetailItem>> = {
  'burova-dva-izmereniya': {
    publishedAt: '13.07.2026',
    location: '3 этаж',
    register: true,
    paragraphs: [
      'На 3 этаже ТРЦ «Щёлковский» совместно с «ОКЦ ВАО» открылась выставка художницы Надежды Буровой «Два измерения: фолк-сюр и классика в интерьере». Экспозиция объединяет декоративное искусство и живопись, в которых традиционные русские мотивы переосмыслены в современном художественном прочтении.',
      'На выставке представлены работы из нескольких авторских серий. Центральное место занимает цикл «Фолк», посвящённый образам русской природы. Берёза – один из главных символов России, становится основой художественного повествования о красоте, гармонии и связи человека с природой. Серия «Русский сюр» предлагает зрителям взглянуть на привычные культурные образы с неожиданной стороны: знакомые мотивы сочетаются с элементами фантазии и сюрреализма, открывая пространство для собственных интерпретаций.',
      'Надежда Бурова – московская художница, работающая в жанре декоративного искусства. Её произведения находятся на стыке живописи и интерьерного декора: каждая работа представляет собой уникальный арт-объект, в котором большое внимание уделяется фактуре, символике и авторской технике исполнения.',
      'Посетить экспозицию можно до 2 августа 2026 года в часы работы ТРЦ «Щёлковский».',
    ],
    program: [
      { time: '13:00–14:00', title: 'Начало мероприятия' },
      { time: '13:00–16:00', title: 'Мастер-класс «Берёзовая роспись по дереву»' },
      {
        time: '14:00–15:00',
        title: 'Лекторий «Современный фолк: от народных традиций к арт-объекту»',
      },
      { time: '16:00–18:00', title: 'Арт-квест для всей семьи «Найди символ»' },
    ],
  },
  'monstry-na-kanikulah': {
    location: '0 этаж',
  },
  'muzykalnoe-loto': {
    location: 'Фудкорт',
  },
}

function buildFallbackDetail(
  card: EventAfishaItem,
  detail?: Partial<EventDetailItem>,
): EventDetailItem {
  return {
    ...card,
    ...detail,
    when: detail?.when ?? formatEventWhen(card.dateStart, card.dateEnd),
    paragraphs: detail?.paragraphs ?? [card.description],
  }
}

export function getEventDetailBySlug(slug: string): EventDetailItem | undefined {
  const card = getEventItemById(slug)

  if (!card) {
    return undefined
  }

  return buildFallbackDetail(card, eventsDetailsBySlug[slug])
}
