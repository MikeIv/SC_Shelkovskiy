/**
 * Типы SDK виджета Афиши (`afisha.ru/w/afishaWidgetManager.global.js`).
 *
 * Документация: `https://dev.afisha.ru/afisha-widget-manager/`. Пакет не ставим: скрипт
 * грузится по требованию (подход к разделу «Кино» или клик «Купить билет»), поэтому описан
 * только используемый набор.
 */

/** Экраны виджета, которые нам нужны (`ROUTES` в SDK). */
export type AfishaWidgetRoute =
  /** Расписание произведения: сеансы фильма и переход к покупке. */
  | 'creation'
  /** Расписание площадки: сеансы кинотеатра ТРЦ. */
  | 'place'

export type AfishaWidgetEmbedType = 'inline' | 'modal' | 'popup'

/** Параметры `appendWidget` — подмножество `WidgetParams` пакета. */
export type AfishaWidgetParams = {
  route: AfishaWidgetRoute
  embedType: AfishaWidgetEmbedType
  /** Тип произведения: расписание фильма. */
  creationType?: 'movie'
  creationId?: string
  cityId?: string
  /** Площадка Афиши: фильтр расписания и экран `place`. */
  placeId?: string
}

/** Экземпляр виджета: `destroy` снимает iframe, когда раздел размонтирован. */
export type AfishaWidgetInstance = {
  destroy?: () => Promise<void> | void
}

export type AfishaWidgetManager = {
  /** `parent` — DOM-элемент: в общих типах нет `document`, поэтому `unknown`. */
  appendWidget: (params: AfishaWidgetParams, parent?: unknown) => Promise<AfishaWidgetInstance>
}
