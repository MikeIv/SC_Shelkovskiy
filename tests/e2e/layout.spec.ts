import { expect, test } from '@playwright/test'

const PARALLEL_LOADS = 6

/** Подвал гасит переходы при `prefers-reduced-motion`, поэтому цвет ховера читается сразу. */
test.use({ reducedMotion: 'reduce' })

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

  /**
   * MAX и Дзен — локальные глифы (`currentColor`), одного размера с основными соцсетями
   * и с одним ховером: цвета бренда у них нет, работает цвет подвала по умолчанию.
   *
   * Локальную иконку `@nuxt/icon` рисует CSS-маской, поэтому в DOM это `span.iconify`
   * с именем глифа, а не `<svg>`.
   */
  test('иконки MAX и Дзен совпадают по размеру с основными и ховерят одинаково', async ({
    page,
  }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const icons = [
      { label: 'Вконтакте', name: 'i-local:social-vk' },
      { label: 'Max', name: 'i-local:social-max' },
      { label: 'Dzen', name: 'i-local:social-dzen' },
    ] as const

    const boxes: { width: number; height: number }[] = []

    for (const { label, name } of icons) {
      const icon = footer.getByRole('link', { name: label }).locator('span[class*="iconify"]')

      await expect(icon, `${label}: локальный глиф вместо картинки`).toHaveClass(new RegExp(name))

      const box = await icon.boundingBox()
      expect(box, `${label}: иконка отрисована`).not.toBeNull()
      boxes.push({ width: box?.width ?? 0, height: box?.height ?? 0 })
    }

    expect(boxes[1]).toEqual(boxes[0])
    expect(boxes[2]).toEqual(boxes[0])

    /** Незнакомая сеть по-прежнему приходит картинкой с бэкенда. */
    await expect(footer.getByRole('link', { name: 'Threads' }).locator('img')).toBeVisible()

    const hoverColor = async (name: string): Promise<string> => {
      const link = footer.getByRole('link', { name })
      await link.hover()

      return link.evaluate((element) => getComputedStyle(element).color)
    }

    expect(await hoverColor('Dzen')).toBe(await hoverColor('Max'))
  })

  /**
   * `@pinia/nuxt` снимает активную Pinia в `app:rendered` любого запроса, поэтому
   * параллельный SSR не должен отдавать 500. В CI один воркер — гонка видна только здесь.
   */
  test('параллельные загрузки страницы отдают 200', async ({ browser }) => {
    const pages = await Promise.all(Array.from({ length: PARALLEL_LOADS }, () => browser.newPage()))

    try {
      const responses = await Promise.all(pages.map((page) => page.goto('/')))

      expect(responses.map((response) => response?.status())).toEqual(
        Array.from({ length: PARALLEL_LOADS }, () => 200),
      )
      await Promise.all(pages.map((page) => expect(page.locator('footer')).toBeVisible()))
    } finally {
      await Promise.all(pages.map((page) => page.close()))
    }
  })
})
