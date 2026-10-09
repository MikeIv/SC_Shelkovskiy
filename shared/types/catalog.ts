/** Вариант отображения карточки арендатора в каталоге. */
export type CatalogCardLayout = 'card' | 'list'

/** Теги акций и программ на карточке арендатора (не более трёх). */
export type CatalogCardTag = 'loyalty' | 'action' | 'lunch'

/** `status` арендатора. В карточке не показывается — нужен схеме (волна 7). */
export type TenantStatus = 'none' | 'new' | 'soon'

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
  /** Завтраки (фильтр каталога кафе). */
  breakfast?: boolean
  /** Slug категории из `meta.filters`. Мок его не задаёт и фильтруется по `category`. */
  categorySlug?: string
  /** Не выводится. Нужен волне 7. */
  status?: TenantStatus
  /** Номер места на схеме. Не выводится. Нужен волне 7. */
  podium?: string
  /** Страница описания бренда. */
  to?: string
  /**
   * Ссылка на схему с подсветкой арендатора.
   * `/map` или `/map?tenant={id}`.
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

/** Пункт фильтра каталога. `value` категории — slug, этажа — `floor.name`. */
export type CatalogFilterChoice = {
  value: string
  label: string
  count: number
}

/** Список раздела каталога после маппинга. `total` — число карточек: у ручки нет `meta.total`. */
export type CatalogListData = {
  items: CatalogCardItem[]
  filters: {
    categories: CatalogFilterChoice[]
    floors: CatalogFilterChoice[]
  }
  total: number
}
