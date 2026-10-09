import { expect, test } from '@playwright/test'

const carousel = 'section[aria-roledescription="carousel"]'

test.describe('Главная страница', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('слайдер строит кадры через ipx и они отдаются', async ({ page }) => {
    await expect(page.locator(carousel)).toBeVisible()
    await expect(page.locator(`${carousel} img`)).toHaveCount(2)

    const src = await page.locator(`${carousel} img`).first().getAttribute('src')
    expect(src).toContain('/_ipx/')

    const image = await page.request.get(src as string)
    expect(image.status()).toBe(200)
    expect(image.headers()['content-type']).toContain('image/webp')
  })

  test('на странице один h1, а заголовок слайда — h2', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator(`${carousel} h2`)).toHaveCount(1)
  })

  test('кнопка листает слайды и обновляет счётчик', async ({ page }) => {
    const counter = page.locator(`${carousel} [aria-live="polite"]`)

    await expect(counter).toHaveText('1/2')

    /**
     * В dev-режиме разметка приходит из SSR раньше обработчиков: клик до гидратации
     * теряется, поэтому действие повторяем, пока счётчик не обновится.
     */
    await expect(async () => {
      await page.getByRole('button', { name: 'Следующий слайд' }).click()
      await expect(counter).toHaveText('2/2', { timeout: 1_000 })
    }).toPass({ timeout: 15_000 })
  })
})
