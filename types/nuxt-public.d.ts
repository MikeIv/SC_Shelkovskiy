declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    /** Базовый URL HTTP API (без завершающего `/`). Пример: `https://api.example.com` или `/api` для прокси. */
    apiBase: string
    /** Ключ виджета Афиши: публичный, нужен только разделу «Кино» (`useAfishaWidget`). */
    afishaWidgetKey: string
    /** Площадка Афиши (кинотеатр ТРЦ) для расписания и виджета. */
    afishaWidgetPlaceId: string
    /** Город площадки — `cityId` в параметрах виджета покупки. */
    afishaWidgetCityId: string
  }
}

export {}
