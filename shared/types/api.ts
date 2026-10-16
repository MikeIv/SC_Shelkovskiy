/**
 * Общие HTTP-типы без доменной логики.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/** Методы записи: мутации ручек, у которых нет кэша и ключа. */
export type ApiWriteMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** Пагинация списков Laravel (`current_page`, `last_page`, `per_page`, `total`). */
export type ApiListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

/** Варианты фильтров в `meta` списков. Состав полей зависит от ручки. */
export type ApiFilters = Record<string, unknown>

export type ApiFieldErrors = Record<string, string[]>

export type ApiError = {
  message: string
  errors?: ApiFieldErrors
}

export type ApiEnvelope<T> = {
  data: T
  meta?: ApiListMeta
}

export type UnknownJson = Record<string, unknown>
