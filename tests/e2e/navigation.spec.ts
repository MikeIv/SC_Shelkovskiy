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

    /**
     * Регрессия волны 3: `LayoutInnerPage` без `title` сносил `<title>` целиком.
     * Точное значение (`seo.title` из API) проверяет `news.spec.ts`.
     */
    await expect.poll(() => page.title()).not.toBe('')
  })

  test('карточка ленты на главной открывает детальную новости', async ({ page }) => {
    await page.goto('/')

    const news = page.locator('section').filter({ has: page.locator('#home-news-title') })
    const card = news.locator('a[href^="/news/"]').first()
    await expect(card).toBeVisible()

    /** Регрессия волны 3: ссылка с главной вела на 404, потому что детальная жила на моке. */
    const response = await page.goto((await card.getAttribute('href')) as string)

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
  })
})
