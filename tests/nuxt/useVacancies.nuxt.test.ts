import { describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { vacanciesItems } from '~/data/vacanciesPage'
import { VacanciesProbe } from './support/VacanciesProbe'

/** Уже смапленный ответ прокси: карточки аккордеона с контактами. */
const envelope = {
  data: [
    {
      id: 'svarschik',
      title: 'Сварщик',
      contacts: {
        name: 'Служба эксплуатации',
        phone: '+7 (499) 677-88-88',
        phoneHref: 'tel:+74996778888',
        email: 'hr@x.ru',
        emailHref: 'mailto:hr@x.ru',
      },
      sections: [{ title: 'Обязанности:', items: ['Сварка трубопроводов'] }],
    },
    { id: 'street-beat', title: 'Продавец-консультант Street Beat', sections: [] },
  ],
}

describe('useVacancies', () => {
  it('берёт вакансии из ручки /api/vacancies', async () => {
    registerEndpoint('/api/vacancies', () => envelope)

    const wrapper = await mountSuspended(VacanciesProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-count')).toBe('2'))
    expect(wrapper.attributes('data-fallback')).toBe('false')
    expect(wrapper.attributes('data-first')).toBe('Сварщик')
    expect(wrapper.attributes('data-phone')).toBe('tel:+74996778888')
  })

  it('подставляет мок, если ручка ответила ошибкой', async () => {
    registerEndpoint('/api/vacancies', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(VacanciesProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-fallback')).toBe('true'))
    expect(wrapper.attributes('data-count')).toBe(String(vacanciesItems.length))
    expect(wrapper.attributes('data-first')).toBe(vacanciesItems[0]?.title)
  })
})
