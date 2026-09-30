declare module '#app' {
  interface PageMeta {
    /** Шапка поверх первого экрана (белая, вне потока). */
    headerOverlay?: boolean
    /** Фоновый орнамент layout: явный side перекрывает эвристику каталога. */
    patternSide?: 'left' | 'right'
  }
}

export {}
