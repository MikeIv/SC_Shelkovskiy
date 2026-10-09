import { expect, test } from '@playwright/test'

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
})
