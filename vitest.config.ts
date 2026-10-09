import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

/**
 * Vitest в двух проектах (их создаёт `defineVitestConfig`):
 * - `node` — чистая логика и серверный слой: `tests/unit`, `tests/server`;
 * - `nuxt` — компоненты и composables: файлы `*.nuxt.test.ts` в `tests/nuxt` (окружение поднимает Nuxt).
 *
 * Тесты живут в `tests/`, а не рядом с исходниками: файлы внутри `server/api` стали бы роутами Nitro,
 * а внутри `app/components` — компонентами.
 */
export default defineVitestConfig({
  resolve: {
    alias: {
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/server/**/*.test.ts'],
    /** Nuxt-окружение поднимается небыстро, а серверные тесты ходят в мок-API. */
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
