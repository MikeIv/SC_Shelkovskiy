import { expect, test } from '@playwright/test'

test.describe('Навигация и вёрстка страниц', () => {
  test('каталог открывается и держит единственный h1', async ({ page }) => {
    const response = await page.goto('/shops')

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('лента новостей ведёт на карточку', async ({ page }) => {
    await page.goto('/news')

    const card = page.locator('a[href^="/news/"]').first()
    await expect(card).toBeVisible()

    await card.click()

    await expect(page).toHaveURL(/\/news\/.+/)
    await expect(page.locator('h1')).toHaveCount(1)
  })
})
