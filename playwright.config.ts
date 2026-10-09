import { defineConfig, devices } from '@playwright/test'

const MOCK_API_PORT = Number(process.env.MOCK_API_PORT ?? 4788)
const APP_PORT = Number(process.env.E2E_PORT ?? 4789)
const DIRECT_APP_PORT = Number(process.env.E2E_DIRECT_PORT ?? 4790)

const MOCK_API_URL = `http://127.0.0.1:${MOCK_API_PORT}`
const APP_URL = `http://127.0.0.1:${APP_PORT}`
const DIRECT_APP_URL = `http://127.0.0.1:${DIRECT_APP_PORT}`

/**
 * E2E идёт против dev-сервера Nitro с мок-API на фикстурах: наполнение стенда не должно
 * влиять на зелёный прогон. Поднимаются три сервера — мок Laravel и два приложения:
 * в режиме прокси (`NUXT_PUBLIC_API_BASE` пуст) и в прямом (браузер ходит в API сам).
 */
export default defineConfig({
  testDir: './tests/e2e',
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
      name: 'chromium',
      /** Спецификации прямого режима проверяются отдельным проектом на своём приложении. */
      testIgnore: /direct[\\/]/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-direct',
      testDir: './tests/e2e/direct',
      use: { ...devices['Desktop Chrome'], baseURL: DIRECT_APP_URL },
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
      /* `--host 127.0.0.1`: без него Nuxt dev слушает только IPv6 localhost и Playwright его не видит. */
      command: `node node_modules/nuxt/bin/nuxt.mjs dev --host 127.0.0.1 --port ${APP_PORT}`,
      url: APP_URL,
      env: {
        NUXT_API_UPSTREAM: `${MOCK_API_URL}/api/v1`,
        NUXT_API_AUTH: '',
        NUXT_PUBLIC_API_BASE: '',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      /** Прямой режим: абсолютный `apiBase`, ручек Nitro у статического стенда нет. */
      command: `node node_modules/nuxt/bin/nuxt.mjs dev --host 127.0.0.1 --port ${DIRECT_APP_PORT}`,
      url: DIRECT_APP_URL,
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
