import { expect, test } from '@playwright/test'

const PARALLEL_LOADS = 6

test.describe('Layout со стенда', () => {
  test('подвал берёт соцсеть из API и оставляет телефон мока, если контакты пустые', async ({
    page,
  }) => {
    const layoutCalls: string[] = []
    page.on('request', (request) => {
      if (request.url().includes('/api/layout')) layoutCalls.push(request.url())
    })

    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer.getByRole('link', { name: 'Dzen' })).toBeVisible()
    await expect(footer.getByRole('link', { name: '+7 (499) 677-44-44' })).toBeVisible()

    const callsAfterLoad = layoutCalls.length
    await page.getByRole('link', { name: 'Магазины' }).first().click()
    await expect(page).toHaveURL(/\/shops/)
    expect(layoutCalls).toHaveLength(callsAfterLoad)
  })

  /**
   * `@pinia/nuxt` снимает активную Pinia в `app:rendered` любого запроса, поэтому
   * параллельный SSR не должен отдавать 500. В CI один воркер — гонка видна только здесь.
   */
  test('параллельные загрузки страницы отдают 200', async ({ browser }) => {
    const pages = await Promise.all(Array.from({ length: PARALLEL_LOADS }, () => browser.newPage()))

    try {
      const responses = await Promise.all(pages.map((page) => page.goto('/')))

      expect(responses.map((response) => response?.status())).toEqual(
        Array.from({ length: PARALLEL_LOADS }, () => 200),
      )
      await Promise.all(pages.map((page) => expect(page.locator('footer')).toBeVisible()))
    } finally {
      await Promise.all(pages.map((page) => page.close()))
    }
  })
})
