import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HomeCinema from '~/components/home/Cinema.vue'
import { homeCinemaItems } from '~/data/homeCinemaItems'

/**
 * Раздел «Кино»: карточки из API или встроенное расписание Афиши.
 *
 * Виджет поднимается только на клиенте и грузит SDK по сети, поэтому здесь проверяем
 * выбор ветки: без данных из API — контейнер виджета, с данными — лента карточек.
 */

describe('HomeCinema', () => {
  it('без данных из API подставляет расписание Афиши вместо заглушек', async () => {
    const wrapper = await mountSuspended(HomeCinema, {
      props: { items: [], isDemo: true },
    })

    expect(wrapper.find('#home-cinema-title').text()).toBe('Кино')
    expect(wrapper.findAll('article')).toHaveLength(0)
    /** Ярлык «Демо-данные» — только у карточек-заглушек, у виджета данные настоящие. */
    expect(wrapper.text()).not.toContain('Демо-данные')
    /** В виджете все сеансы уже есть, отдельная ссылка вела бы в общий каталог. */
    expect(wrapper.text()).not.toContain('Смотреть все')
  })

  it('моки без доступа к API тоже уступают место виджету', async () => {
    const wrapper = await mountSuspended(HomeCinema, {
      props: { items: homeCinemaItems, isDemo: true },
    })

    expect(wrapper.findAll('article')).toHaveLength(0)
  })

  it('с данными из API показывает ленту карточек', async () => {
    const wrapper = await mountSuspended(HomeCinema, {
      props: { items: homeCinemaItems },
    })

    expect(wrapper.findAll('article')).toHaveLength(homeCinemaItems.length)
    expect(wrapper.text()).not.toContain('Демо-данные')
    expect(wrapper.text()).toContain('Смотреть все')
  })

  it('в карточке показывает ближайший сеанс и цену с разрядами', async () => {
    const [mock] = homeCinemaItems
    const wrapper = await mountSuspended(HomeCinema, {
      props: {
        items: [{ ...mock!, sessionTime: '11:25', priceFrom: 1200 }],
      },
    })

    expect(wrapper.text()).toContain('11:25 · от 1 200 ₽')
  })
})
