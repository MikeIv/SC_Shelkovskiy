import { expect, test } from '@playwright/test'

/**
 * Прямой режим данных — то, как работает статический стенд: серверных ручек `/api/*` нет,
 * браузер идёт в Laravel сам (`NUXT_PUBLIC_API_BASE` — абсолютный URL), картинки отдаются
 * как есть, без ipx. Мок-API при этом отдаёт CORS-заголовки, как боевой Laravel после
 * настройки `config/cors.php`.
 *
 * В dev модули страницы компилируются по требованию, поэтому клики до гидратации теряются:
 * действия повторяются через `toPass`, как в остальных e2e.
 */

const MOCK_API = 'http://127.0.0.1:4788/api/v1'
const carousel = 'section[aria-roledescription="carousel"]'

test.describe('Прямой режим данных', () => {
  test('SSR отдаёт данные из API, а браузер не ходит в свои ручки', async ({ page }) => {
    const apiCalls: string[] = []
    const ownApiCalls: string[] = []

    page.on('request', (request) => {
      const url = request.url()

      if (url.startsWith(`${MOCK_API}/`)) apiCalls.push(new URL(url).pathname)
      else if (new URL(url).pathname.startsWith('/api/')) ownApiCalls.push(url)
    })

    const response = await page.goto('/')

    expect(response?.status()).toBe(200)
    await expect(page.locator(carousel)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Тестовая акция' })).toBeVisible()

    /** Данные пришли из пейлоада: ручек Nitro у статического стенда нет и запросов к ним нет. */
    expect(apiCalls).toEqual([])
    expect(ownApiCalls).toEqual([])
  })

  test('картинки идут с API как есть: ipx в прямом режиме выключен', async ({ page }) => {
    await page.goto('/')

    const src = await page.locator(`${carousel} img`).first().getAttribute('src')

    expect(src).not.toContain('/_ipx/')
    expect(src).toContain('/images/home/')
  })

  test('клиентские запросы идут прямо в API, а не в ручки Nitro', async ({ page }) => {
    const apiCalls: string[] = []
    const ownApiCalls: string[] = []

    page.on('request', (request) => {
      const url = request.url()

      if (url.startsWith(`${MOCK_API}/`)) apiCalls.push(new URL(url).pathname)
      else if (new URL(url).pathname.startsWith('/api/')) ownApiCalls.push(url)
    })

    await page.goto('/news')
    await expect(
      page.getByRole('heading', { name: 'Тестовая новость о зимней коллекции' }),
    ).toBeVisible()

    const cards = page.locator('a[href^="/news/"]')
    await expect(cards).toHaveCount(12)

    /** Императивный вызов `useApi()`: страница ленты догружается клиентом. */
    await expect(async () => {
      await page.getByRole('button', { name: 'Показать ещё' }).click()
      await expect(
        page.getByRole('heading', { name: 'Тестовая новость с последней страницы' }),
      ).toBeVisible({ timeout: 1_000 })
    }).toPass({ timeout: 15_000 })

    await expect(cards).toHaveCount(13)

    /** Реактивный `useApiFetch()`: смена вкладки берёт другой тип ленты. */
    await expect(async () => {
      await page.getByRole('tab', { name: 'Акции' }).click()
      await expect(page.getByRole('heading', { name: 'Тестовая акция магазина' })).toBeVisible({
        timeout: 1_000,
      })
    }).toPass({ timeout: 15_000 })

    /** Оба запроса ушли в Laravel напрямую: своих ручек у статического стенда нет. */
    await expect.poll(() => apiCalls, { timeout: 10_000 }).toContain('/api/v1/feed')
    expect(ownApiCalls).toEqual([])
  })

  test('детальная страница получает связанные материалы из API', async ({ page }) => {
    const response = await page.goto('/news/test-news-one')

    expect(response?.status()).toBe(200)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Тестовая новость о зимней коллекции' }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Другие новости' })).toBeVisible()
    await expect(page).toHaveTitle('Тестовая новость — SEO')
  })
})
