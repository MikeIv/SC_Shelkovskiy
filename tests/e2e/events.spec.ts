import { expect, test } from '@playwright/test'

test.describe('Афиша', () => {
  test('список приходит из API и ведёт на мероприятие', async ({ page }) => {
    const response = await page.goto('/events')

    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'Мероприятия' })).toBeVisible()

    const card = page.locator('a[href="/events/test-event-one"]')
    await expect(
      card.getByRole('heading', { name: 'Тестовое мероприятие в атриуме' }),
    ).toBeVisible()
    await expect(card).toContainText('сентября')
    await expect(card).toContainText('октября')

    await card.click()

    await expect(page).toHaveURL(/\/events\/test-event-one$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Тестовое мероприятие в атриуме' }),
    ).toBeVisible()
    await expect(page.getByText('29 сентября — 2 октября, 19:00')).toBeVisible()
    await expect(page.getByText('0 этаж')).toBeVisible()
    await expect(page.getByText('Первый абзац мероприятия.')).toBeVisible()
    await expect(page.getByText('Открытие')).toBeVisible()

    /** `seo.title` из API доходит до `<title>`. */
    await expect(page).toHaveTitle('Тестовое мероприятие — SEO')
  })

  test('кнопка регистрации открывает попап подписки', async ({ page }) => {
    await page.goto('/events/test-event-one')

    const register = page.getByRole('button', { name: 'Зарегистрироваться' })
    await expect(register).toBeVisible()

    /** Клик до гидратации в dev-режиме теряется: повторяем, пока попап не откроется. */
    await expect(async () => {
      await register.click()
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 1_000 })
    }).toPass({ timeout: 15_000 })

    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('link', { name: 'Подписаться на MAX' })).toBeVisible()
  })

  test('каждая карточка афиши открывает своё мероприятие', async ({ page }) => {
    await page.goto('/events')

    const second = page.locator('a[href="/events/test-event-two"]')
    await expect(second).toBeVisible()

    await second.click()

    await expect(page).toHaveURL(/\/events\/test-event-two$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Тестовый мастер-класс' }),
    ).toBeVisible()
    await expect(page.getByText('5 октября')).toBeVisible()

    /** Без `seo.title` в заголовок страницы идёт заголовок карточки. */
    await expect(page).toHaveTitle('Тестовый мастер-класс')
    await expect(page.getByRole('button', { name: 'Зарегистрироваться' })).toHaveCount(0)
  })

  test('неизвестный slug даёт 404', async ({ page }) => {
    const response = await page.goto('/events/test-unknown-event')

    expect(response?.status()).toBe(404)
  })
})
