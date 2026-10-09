import { expect, test } from '@playwright/test'

test.describe('Лента новостей', () => {
  test('вкладки переключают тип, «показать ещё» догружает страницу', async ({ page }) => {
    const response = await page.goto('/news')

    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'Новости и акции' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Тестовая новость о зимней коллекции' }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Тестовая новость про фудкорт' })).toBeVisible()

    /** `per_page` из запроса: на странице ровно 12 карточек из 13. */
    const cards = page.locator('a[href^="/news/"]')
    await expect(cards).toHaveCount(12)

    /**
     * В dev-режиме разметка приходит из SSR раньше обработчиков: клик до гидратации
     * теряется, поэтому действие повторяем, пока карточка не появится.
     */
    await expect(async () => {
      await page.getByRole('button', { name: 'Показать ещё' }).click()
      await expect(
        page.getByRole('heading', { name: 'Тестовая новость с последней страницы' }),
      ).toBeVisible({ timeout: 1_000 })
    }).toPass({ timeout: 15_000 })

    /** Догрузка дописывает страницу, а не повторяет её. */
    await expect(cards).toHaveCount(13)
    await expect(page.getByRole('button', { name: 'Показать ещё' })).toHaveCount(0)

    await expect(async () => {
      await page.getByRole('tab', { name: 'Акции' }).click()
      await expect(page.getByRole('heading', { name: 'Тестовая акция магазина' })).toBeVisible({
        timeout: 1_000,
      })
    }).toPass({ timeout: 15_000 })

    await expect(page.getByRole('heading', { name: 'Тестовая акция фудкорта' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Тестовая новость про фудкорт' })).toHaveCount(0)

    await expect(async () => {
      await page.getByRole('tab', { name: 'СМИ о нас' }).click()
      await expect(page.getByRole('heading', { name: 'Тестовая публикация в СМИ' })).toBeVisible({
        timeout: 1_000,
      })
    }).toPass({ timeout: 15_000 })

    await expect(page.getByRole('heading', { name: 'Тестовая акция магазина' })).toHaveCount(0)
  })

  test('карточка открывает детальную с текстом, арендатором и связанными', async ({ page }) => {
    const response = await page.goto('/news/test-news-one')

    expect(response?.status()).toBe(200)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Тестовая новость о зимней коллекции' }),
    ).toBeVisible()
    await expect(page.getByText('Первый абзац тестового текста.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Смотреть на схеме' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Другие новости' })).toBeVisible()

    /** `seo.title` из API доходит до `<title>`. */
    await expect(page).toHaveTitle('Тестовая новость — SEO')

    /** Инлайн-стиль и `<script>` из CMS сняты маппером до `v-html`. */
    const second = page.getByText('Второй абзац тестового текста.')
    await expect(second).toBeVisible()
    expect(await second.getAttribute('style')).toBeNull()
    expect(await page.content()).not.toContain('alert(')
  })

  test('акция показывает срок, а без seo берётся заголовок карточки', async ({ page }) => {
    const response = await page.goto('/news/test-action-one')

    expect(response?.status()).toBe(200)
    await expect(page.getByText('Срок акции: 1 октября — 31 октября')).toBeVisible()
    await expect(page).toHaveTitle('Тестовая акция магазина')
  })

  test('неизвестный slug даёт 404', async ({ page }) => {
    const response = await page.goto('/news/test-unknown-slug')

    expect(response?.status()).toBe(404)
  })
})
