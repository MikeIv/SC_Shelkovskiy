/** Вариант отображения карточки арендатора в каталоге. */
export type CatalogCardLayout = 'card' | 'list'

/** Теги акций и программ на карточке арендатора (не более трёх). */
export type CatalogCardTag = 'loyalty' | 'action' | 'lunch'

/** Данные карточки арендатора для каталога магазинов / кафе / услуг. */
export type CatalogCardItem = {
  id: string
  /** Логотип бренда; пустое значение — заглушка в UI. */
  imageSrc: string
  imageAlt: string
  /** Категория: mob — до 2 строк, tablet/desk — 1 строка, троеточие. */
  category: string
  /** Название бренда: mob — до 2 строк, tablet/desk — 1 строка, троеточие. */
  title: string
  floor: string
  /** До трёх тегов; необязательный блок. */
  tags?: CatalogCardTag[]
  /** Страница описания бренда. */
  to?: string
  /**
   * Ссылка на схему с подсветкой арендатора.
   * До появления схемы — заглушка `/map` (или `/map?tenant={id}`).
   */
  mapUrl?: string
  /** Идентификатор арендатора для подсветки на схеме (будущий API). */
  tenantId?: string
}

/** Группа арендаторов в алфавитном списке каталога. */
export type CatalogListGroup = {
  letter: string
  items: CatalogCardItem[]
}
