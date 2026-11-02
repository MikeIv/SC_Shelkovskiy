import { defineConfig, devices } from '@playwright/test'

const MOCK_API_PORT = Number(process.env.MOCK_API_PORT ?? 4788)
const APP_PORT = Number(process.env.E2E_DIRECT_PORT ?? 4790)

const MOCK_API_URL = `http://127.0.0.1:${MOCK_API_PORT}`
const APP_URL = `http://127.0.0.1:${APP_PORT}`

/**
 * Прямой режим данных: абсолютный `NUXT_PUBLIC_API_BASE`, ручек `/api/*` браузер не трогает,
 * картинки идут без ipx — так работает статический стенд.
 *
 * Отдельный конфиг, а не проект в `playwright.config.ts`: Nuxt CLI v4 блокирует `.nuxt`
 * на время работы dev-сервера, поэтому два приложения поднимаются последовательными
 * прогонами (`pnpm test:e2e`), а не одновременно.
 */
export default defineConfig({
  testDir: './tests/e2e/direct',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: APP_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-direct',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'node tests/mocks/apiServer.mjs',
      url: `${MOCK_API_URL}/__health`,
      env: { MOCK_API_PORT: String(MOCK_API_PORT) },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `node node_modules/nuxt/bin/nuxt.mjs dev --host 127.0.0.1 --port ${APP_PORT}`,
      url: APP_URL,
      env: {
        NUXT_API_UPSTREAM: '',
        NUXT_API_AUTH: '',
        NUXT_PUBLIC_API_BASE: `${MOCK_API_URL}/api/v1`,
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
