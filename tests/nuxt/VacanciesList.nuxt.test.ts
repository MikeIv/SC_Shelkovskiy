import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VacancyItem } from '#shared/types/vacancies'
import VacanciesList from '~/components/vacancies/List.vue'

/**
 * Карточка контактов приходит из API с nullable-полями, поэтому разметка показывает
 * строки «Телефон» и «Почта» только там, где данные есть.
 */
const section = { title: 'Обязанности:', items: ['Работа с покупателями'] }

async function mountOpen(items: readonly VacancyItem[]) {
  const wrapper = await mountSuspended(VacanciesList, { props: { items } })

  await wrapper.find('button[type="button"]').trigger('click')

  return wrapper
}

describe('VacanciesList — контакты из API', () => {
  it('выводит телефон и почту ссылками, когда поля заполнены', async () => {
    const wrapper = await mountOpen([
      {
        id: 'maag',
        title: 'Консультант-кассир',
        contacts: {
          name: 'Отдел персонала',
          phone: '+7 (499) 677-88-88',
          phoneHref: 'tel:+74996778888',
          email: 'hr@x.ru',
          emailHref: 'mailto:hr@x.ru',
        },
        sections: [section],
      },
    ])

    const links = wrapper.findAll('a')

    expect(links.map((link) => link.attributes('href'))).toEqual([
      'tel:+74996778888',
      'mailto:hr@x.ru',
    ])
    expect(wrapper.text()).toContain('Отдел персонала')
    expect(wrapper.text()).toContain('Телефон')
    expect(wrapper.text()).toContain('Почта')
  })

  it('не выводит строку телефона, если заполнена только почта', async () => {
    const wrapper = await mountOpen([
      {
        id: 'maag',
        title: 'Консультант-кассир',
        contacts: {
          name: '',
          phone: '',
          phoneHref: '',
          email: 'recruitment@rmixed.ru',
          emailHref: 'mailto:recruitment@rmixed.ru',
        },
        sections: [section],
      },
    ])

    expect(wrapper.text()).not.toContain('Телефон')
    expect(wrapper.text()).toContain('recruitment@rmixed.ru')
  })

  it('не рисует карточку контактов, если их нет', async () => {
    const wrapper = await mountOpen([{ id: 'svarschik', title: 'Сварщик', sections: [section] }])

    expect(wrapper.text()).not.toContain('Контакты')
  })
})
