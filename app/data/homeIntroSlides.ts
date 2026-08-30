import type { HomeIntroSlide } from '#shared/types/home'

/** Временные слайды до контракта админки. */
export const homeIntroSlides: HomeIntroSlide[] = [
  {
    id: 'mermaid',
    title: 'Интерактивный спектакль «Русалочка. Тайна морских глубин»',
    description:
      '18 июля на 0 этаже ТРЦ «Щёлковский» юных гостей ждёт настоящее путешествие в подводное царство',
    imageSrc: '/images/home/intro-1.png',
    imageAlt: '',
  },
  {
    id: 'exhibition',
    title: 'Выставка картин Надежды Буровой «Два измерения: фолк-сюр и классика в интерьере»',
    description:
      'На 3 этаже ТРЦ «Щёлковский» совместно с «ОКЦ ВАО» открылась выставка художницы Надежды Буровой «Два измерения: фолк-сюр и классика в интерьере».',
    imageSrc: '/images/home/intro-2.png',
    imageAlt: '',
  },
]
