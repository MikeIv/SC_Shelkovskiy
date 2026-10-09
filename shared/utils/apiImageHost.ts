/**
 * Хост стенда, с которого ipx тянет картинки (`/storage/…`).
 *
 * Один источник для `nuxt.config.ts` (`image.domains` и `runtimeConfig.ipx.http.domains`)
 * и тестов: URL с другого хоста `@nuxt/image` отдаёт как есть, без `/_ipx/`.
 */
export const API_IMAGE_HOST = 'schelkovsky-backend-main.grandfs-develop.ru'
