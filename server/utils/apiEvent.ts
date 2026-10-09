/**
 * Событие обработчика Nitro.
 *
 * Берём тип у `useRuntimeConfig`: и он, и `defineCachedEventHandler` импортируют
 * `H3Event` из `h3` внутри nitropack, поэтому это один и тот же бренд.
 *
 * Автоимпорт `getQuery` так делать нельзя. `nuxt prepare` записывает в него
 * конкретный путь к `h3`, а npm на деплое кладёт рядом вторую копию
 * (h3 2 в корне и h3 1 у Nitro). Классы тогда несовместимы, хотя в рантайме
 * событие одно.
 */
export type ApiEvent = NonNullable<Parameters<typeof useRuntimeConfig>[0]>
