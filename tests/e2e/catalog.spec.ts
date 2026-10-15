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

/**
 * Первая отрисовка без JS: так выглядит SSR-документ до гидрации. Если ширину фильтров
 * задать селектором той же специфичности, что и `.root { width: 100% }` у `UiDropdown`,
 * каскад решает порядок ссылок на CSS-модули — строка фильтров растягивается, а после
 * гидрации приходит в норму скачком.
 */
test.describe('Каталог: первая отрисовка', () => {
  test.use({ javaScriptEnabled: false })

  test('строка фильтров на десктопе собрана сразу', async ({ page }) => {
    await page.goto('/shops')

    const category = page.getByRole('combobox', { name: 'Категория' })
    const floor = page.getByRole('combobox', { name: 'Этаж' })

    /** 20rem = 320px при базовом 16px: ширина не должна теряться в каскаде. */
    await expect(category).toHaveCSS('width', '320px')

    const [categoryBox, floorBox] = await Promise.all([category.boundingBox(), floor.boundingBox()])
    expect(categoryBox).not.toBeNull()
    expect(floorBox).not.toBeNull()
    /** Оба селекта — в одной строке: иначе вторая строка шапки уезжает вниз. */
    expect(Math.abs((categoryBox?.y ?? 0) - (floorBox?.y ?? 0))).toBeLessThanOrEqual(1)

    /** Поиск стоит у заголовка, дубль в тулбаре скрыт. */
    await expect(page.locator('.fs-catalog-search-aside')).toBeVisible()
    await expect(page.locator('.fs-catalog-search-toolbar')).toHaveCount(1)
    await expect(page.locator('.fs-catalog-search-toolbar')).toBeHidden()

    /** Кнопка фильтров — только для узких экранов. */
    const filterButton = page.locator('button[aria-label="Фильтры"]')
    await expect(filterButton).toHaveCount(1)
    await expect(filterButton).toBeHidden()
  })
})
