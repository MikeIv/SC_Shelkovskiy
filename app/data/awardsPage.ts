import type { AwardsDetailItem, AwardsItem } from '#shared/types/awards'
import { normalizeAwardsSlug } from '#shared/utils/awardsPath'

export const awardsPageTitle = 'Социальная активность и награды'

const DEFAULT_IMAGE = '/images/awards/golden-support.webp'

type AwardsDetailContent = {
  readonly date?: string
  readonly dateIso?: string
  readonly subtitle: string
  readonly paragraphs: readonly string[]
  readonly imageSrc?: string
  readonly imageAlt?: string
}

/** Детальный контент по базовому id (без суффикса дубликата). */
const awardsDetailsBySlug: Record<string, AwardsDetailContent> = {
  'golden-support-2023': {
    date: '26.01.2024',
    dateIso: '2024-01-26',
    subtitle: 'Зеленая повестка',
    paragraphs: [
      'ТРЦ «Щёлковский» стал победителем национальной премии потребителей электроэнергии «Золотая опора» 2023 в номинации «Лучший потребитель энергоресурсов в регионе присутствия АО «Мосэнергосбыт».',
      'Мы придерживаемся стратегии ESG, отдавая предпочтение экологической ответственности и внимательному отношению к сохранению природы.',
      'Занять место в ряду самых надежных потребителей электроэнергии Московского региона для нас - большая честь. Мы благодарны АО «Мосэнергосбыт» за стабильное снабжение электроэнергией, а также совместные усилия по снижению потребления ресурсов.',
    ],
    imageSrc: DEFAULT_IMAGE,
    imageAlt: 'Награда «Золотая опора» и диплом ТРЦ «Щёлковский»',
  },
  'cre-green-brick': {
    subtitle: 'Экологическая ответственность',
    paragraphs: [
      'ТРЦ «Щёлковский» стал лауреатом премии CRE Awards в номинации «Зелёный кирпич».',
      'Мы придерживаемся стратегии ESG, отдавая предпочтение экологической ответственности и внимательному отношению к сохранению природы.',
      'Эта награда — признание системной работы центра по снижению нагрузки на окружающую среду и развитию устойчивых практик.',
    ],
  },
  'kp-top-20-2024': {
    subtitle: 'Признание гостей и экспертов',
    paragraphs: [
      'Издание «Комсомольская правда» включило ТРЦ «Щёлковский» в топ-20 лучших торговых центров Москвы 2024 года.',
      'Мы благодарим гостей за доверие и продолжаем развивать пространство, в котором удобно покупать, отдыхать и проводить время с близкими.',
    ],
  },
  'shelter-new-year': {
    subtitle: 'Социальная активность',
    paragraphs: [
      'ТРЦ «Щёлковский» поддержал приют «Родной дом»: средства направлены на организацию новогоднего праздника для воспитанников.',
      'Мы считаем важным участвовать в социальных инициативах и помогать тем, кому особенно нужна поддержка.',
    ],
  },
  'victory-day-decor': {
    subtitle: 'Праздничное оформление',
    paragraphs: [
      'ТРЦ «Щёлковский» стал победителем в конкурсе на лучшее оформление торгово-развлекательного центра ко Дню Победы.',
      'Праздничный декор создавался с уважением к истории и вниманием к атмосфере, в которой гости центра могут разделить памятную дату.',
    ],
  },
}

const itemCreGreenBrick: AwardsItem = {
  id: 'cre-green-brick',
  date: '26.06.2024',
  dateIso: '2024-06-26',
  title: 'ТРЦ «Щёлковский» стал лауреатом премии CRE Awards в номинации «Зелёный кирпич»',
}

const itemKpTop20: AwardsItem = {
  id: 'kp-top-20-2024',
  date: '26.06.2024',
  dateIso: '2024-06-26',
  title:
    'Издание «Комсомольская правда» включило ТРЦ «Щёлковский» в топ-20 лучших торговых центров Москвы 2024 года',
}

const itemShelterNewYear: AwardsItem = {
  id: 'shelter-new-year',
  date: '26.06.2024',
  dateIso: '2024-06-26',
  title: 'Пожертвование приюту «Родной дом» на организацию новогоднего праздника для воспитанников',
}

/** Уникальные карточки для related-слайдера. */
const awardsUniqueItems: readonly AwardsItem[] = [
  {
    id: 'golden-support-2023',
    date: '26.06.2024',
    dateIso: '2024-06-26',
    title:
      'ТРЦ «Щёлковский» стал победителем национальной премии потребителей электроэнергии «Золотая опора» 2023 в номинации «Лучший потребитель энергоресурсов в регионе присутствия АО «Мосэнергосбыт»',
  },
  itemCreGreenBrick,
  itemKpTop20,
  itemShelterNewYear,
  {
    id: 'victory-day-decor',
    date: '26.06.2024',
    dateIso: '2024-06-26',
    title:
      'ТРЦ «Щёлковский» стал победителем в конкурсе на лучшее оформление торгово-развлекательного центра ко Дню Победы',
  },
]

/** Временный контент до контракта API (макет Figma 679:29390). */
export const awardsItems: readonly AwardsItem[] = [
  ...awardsUniqueItems,
  { ...itemShelterNewYear, id: 'shelter-new-year-2' },
  { ...itemKpTop20, id: 'kp-top-20-2024-2' },
  { ...itemCreGreenBrick, id: 'cre-green-brick-2' },
]

function getAwardsItemById(id: string): AwardsItem | undefined {
  return awardsItems.find((item) => item.id === id)
}

export function getAwardsDetailBySlug(slug: string): AwardsDetailItem | undefined {
  const card = getAwardsItemById(slug)
  if (!card) {
    return undefined
  }

  const content = awardsDetailsBySlug[normalizeAwardsSlug(slug)]
  if (!content) {
    return undefined
  }

  return {
    ...card,
    date: content.date ?? card.date,
    dateIso: content.dateIso ?? card.dateIso,
    subtitle: content.subtitle,
    paragraphs: content.paragraphs,
    imageSrc: content.imageSrc ?? DEFAULT_IMAGE,
    imageAlt: content.imageAlt ?? card.title,
  }
}

/** Другие карточки для слайдера (без текущей, без дубликатов по базовому slug). */
export function getRelatedAwardsItems(currentId: string): AwardsItem[] {
  const currentBase = normalizeAwardsSlug(currentId)

  return awardsUniqueItems.filter((item) => item.id !== currentBase)
}
