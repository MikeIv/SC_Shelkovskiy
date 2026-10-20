import { describe, expect, it } from 'vitest'
import { mapVacancies } from '#shared/utils/mappers/vacancies'

/**
 * `GET /vacancies` → карточки аккордеона: ключ списка — `slug`, контакты из админки
 * приходят с `null`, секции без заголовка или пунктов не выводятся.
 */
describe('mapVacancies', () => {
  it('маппит вакансию с секциями и контактами', () => {
    const items = mapVacancies([
      {
        slug: 'svarschik',
        title: 'Сварщик',
        contacts: { name: 'Служба эксплуатации', phone: '+7 (499) 677-88-88', email: 'hr@x.ru' },
        sections: [
          { title: 'Обязанности:', items: ['Сварка трубопроводов', 'Техника безопасности'] },
        ],
      },
    ])

    expect(items).toEqual([
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
        sections: [
          { title: 'Обязанности:', items: ['Сварка трубопроводов', 'Техника безопасности'] },
        ],
      },
    ])
  })

  it('не выводит карточку контактов, если все поля null', () => {
    const items = mapVacancies([
      {
        slug: 'street-beat',
        title: 'Продавец-консультант',
        contacts: { name: null, phone: null, email: null },
        sections: [],
      },
    ])

    expect(items[0]).not.toHaveProperty('contacts')
  })

  it('оставляет карточку, если из контактов заполнена только почта', () => {
    const items = mapVacancies([
      {
        slug: 'maag',
        title: 'Консультант-кассир',
        contacts: { name: null, phone: null, email: 'recruitment@rmixed.ru' },
      },
    ])

    expect(items[0]?.contacts).toEqual({
      name: '',
      phone: '',
      phoneHref: '',
      email: 'recruitment@rmixed.ru',
      emailHref: 'mailto:recruitment@rmixed.ru',
    })
  })

  it('пропускает записи без slug или заголовка и пустые секции', () => {
    const items = mapVacancies([
      { title: 'Без slug' },
      { slug: 'no-title', title: '   ' },
      null,
      'oops',
      {
        slug: 'welder',
        title: 'Сварщик',
        sections: [
          { title: '', items: ['Пункт'] },
          { title: 'Требования:', items: [] },
          { title: 'Условия:', items: [' ', 'Официальное трудоустройство'] },
        ],
      },
    ])

    expect(items).toHaveLength(1)
    expect(items[0]?.id).toBe('welder')
    expect(items[0]?.sections).toEqual([
      { title: 'Условия:', items: ['Официальное трудоустройство'] },
    ])
  })

  it('на пустом списке отдаёт пустой массив', () => {
    expect(mapVacancies([])).toEqual([])
  })
})
