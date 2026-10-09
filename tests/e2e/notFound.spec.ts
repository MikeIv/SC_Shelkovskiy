import { expect, test } from '@playwright/test'

test('несуществующая страница отдаёт 404 и заголовок', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Страница не найдена' })).toBeVisible()
})
