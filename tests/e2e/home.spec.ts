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

  test('лента и галерея берут даты макета, картинки идут через ipx', async ({ page }) => {
    const news = page.locator('section').filter({ has: page.locator('#home-news-title') })
    const gallery = page.locator('section').filter({ has: page.locator('#home-gallery-title') })

    await expect(news.getByRole('heading', { name: 'Тестовая акция' })).toBeVisible()
    await expect(news.getByText('до 31 октября')).toBeVisible()
    await expect(news.getByText('30 сентября')).toBeVisible()
    await expect(gallery.getByRole('heading', { name: 'Тестовый альбом' })).toBeVisible()
    await expect(gallery.getByText('30.05.2026')).toBeVisible()

    const sources = [
      await news.locator('img').first().getAttribute('src'),
      await gallery.locator('img').first().getAttribute('src'),
    ]

    for (const src of sources) {
      expect(src).toContain('/_ipx/')
      expect(src).not.toContain('/storage/')
    }

    await expect(page.getByRole('heading', { name: 'Кино' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Женская одежда' })).toBeVisible()
  })
})
