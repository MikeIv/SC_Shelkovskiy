import { expect, test } from '@playwright/test'

test.describe('Каталог арендаторов', () => {
  test('список, счётчик фильтра и алфавит приходят из API', async ({ page }) => {
    await page.goto('/shops')

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('heading', { name: 'Тестовый магазин' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Альфа' })).toBeVisible()

    const logo = page.locator('img[alt="Тестовый магазин"]')
    await expect(logo).toBeVisible()
    const src = await logo.getAttribute('src')
    expect(src).toContain('/_ipx/')

    const category = page.getByRole('combobox', { name: 'Категория' })
    const clothes = page.getByRole('option', { name: /Одежда/ })

    /**
     * Клик до гидратации теряется: открываем список, пока пункт с счётчиком не появится.
     */
    await expect(async () => {
      if (!(await clothes.isVisible())) {
        await category.click()
      }
      await expect(clothes).toContainText('6', { timeout: 1_000 })
    }).toPass({ timeout: 15_000 })

    await clothes.click()

    await expect(page.getByRole('heading', { name: 'Тестовый магазин' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Альфа' })).toHaveCount(0)

    await page.getByRole('button', { name: 'Список' }).click()
    await expect(page.getByRole('heading', { name: 'Т', exact: true })).toBeVisible()
  })

  test('карточка открывается по slug, чужой раздел даёт 404', async ({ page }) => {
    const response = await page.goto('/shops/test-shop')

    await expect(page.getByRole('heading', { level: 1, name: 'Тестовый магазин' })).toBeVisible()
    await expect(page.getByText('Описание тестового магазина')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Тестовая акция арендатора' })).toBeVisible()

    /** `seo.title` из API доходит до `<title>`: и в SSR-разметке, и в head после гидратации. */
    expect(await response?.text()).toContain('<title>Тестовый магазин</title>')
    await expect(page).toHaveTitle('Тестовый магазин')

    const other = await page.goto('/cafes/test-shop')
    expect(other?.status()).toBe(404)
  })
})
