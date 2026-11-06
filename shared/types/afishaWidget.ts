/**
 * Типы SDK виджета Афиши (`afisha.ru/w/afishaWidgetManager.global.js`).
 *
 * Документация: `https://dev.afisha.ru/afisha-widget-manager/`. Пакет не ставим: скрипт
 * грузится по клику и нужен только разделу «Кино», поэтому описан только используемый набор.
 */

/** Экран расписания произведения: сеансы фильма и переход к покупке (`ROUTES.creation` в SDK). */
export type AfishaWidgetRoute = 'creation'

export type AfishaWidgetEmbedType = 'inline' | 'modal' | 'popup'

/** Параметры `appendWidget` — подмножество `WidgetParams` пакета. */
export type AfishaWidgetParams = {
  route: AfishaWidgetRoute
  embedType: AfishaWidgetEmbedType
  /** Тип произведения: расписание фильма. */
  creationType?: 'movie'
  creationId?: string
  cityId?: string
  /** Предустановленный фильтр по площадке. */
  placeId?: string
}

export type AfishaWidgetManager = {
  /** `parent` — DOM-элемент: в общих типах нет `document`, поэтому `unknown`. */
  appendWidget: (params: AfishaWidgetParams, parent?: unknown) => Promise<unknown>
}
