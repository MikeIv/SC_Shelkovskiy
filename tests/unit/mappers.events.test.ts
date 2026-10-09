import { describe, expect, it } from 'vitest'
import { mapEventDetail, mapEventsList } from '#shared/utils/mappers/events'

const event = {
  slug: 'concert',
  title: 'Концерт в атриуме',
  tag: 'Афиша',
  image: '/images/event.png',
  starts_at: '2026-09-29',
  ends_at: '2026-10-02',
  preview_text: '  Короткое описание  ',
  url: '/events/concert',
}

describe('mapEventsList', () => {
  it('маппит даты, описание и пагинацию', () => {
    const list = mapEventsList({
      data: [event, { ...event, slug: 'no-date', starts_at: null }, { title: 'Без slug' }],
      meta: { current_page: 1, last_page: 2, per_page: 12, total: 13 },
    })

    expect(list.items).toHaveLength(1)
    expect(list.items[0]).toMatchObject({
      id: 'concert',
      dateStart: { day: '29', month: 'сентября' },
      dateEnd: { day: '2', month: 'октября' },
      description: 'Короткое описание',
      tagLabel: 'Афиша',
      to: '/events/concert',
    })
    expect(list.meta).toEqual({ current_page: 1, last_page: 2, per_page: 12, total: 13 })
  })

  it('без даты начала карточка не выводится, без meta пагинации нет', () => {
    const list = mapEventsList({ data: [{ ...event, starts_at: '29.09.2026' }] })

    expect(list.items).toEqual([])
    expect(list.meta).toBeNull()
  })

  it('берёт метку из тега, а без тега — подпись макета', () => {
    expect(mapEventsList({ data: [{ ...event, tag: '  ' }] }).items[0]?.tagLabel).toBe('Афиша')
    expect(mapEventsList({ data: [{ ...event, tag: 'Концерт' }] }).items[0]?.tagLabel).toBe(
      'Концерт',
    )
  })
})

describe('mapEventDetail', () => {
  it('собирает when со временем, место, программу, текст и флаг регистрации', () => {
    const item = mapEventDetail({
      ...event,
      time: '19:00',
      location: '0 этаж',
      floor: '0',
      text: '<p>Первый абзац</p><script>bad()</script>',
      program: [
        { time: '19:00–20:00', title: 'Открытие' },
        { time: '', title: 'Без времени' },
        { time: '20:00–21:00' },
      ],
      show_subscribe_cta: true,
      published_at: '2026-09-20',
      seo: { title: 'Концерт', description: null, keywords: null, og_image: null },
    })

    expect(item).toMatchObject({
      when: '29 сентября — 2 октября, 19:00',
      location: '0 этаж',
      paragraphs: [],
      program: [{ time: '19:00–20:00', title: 'Открытие' }],
      register: true,
      publishedAt: '20.09.2026',
      publishedAtIso: '2026-09-20',
      bodyHtml: '<p>Первый абзац</p>',
      seo: { title: 'Концерт', description: '', keywords: '', ogImage: '' },
    })
  })

  it('без ends_at оставляет одну дату, floor закрывает пустое location', () => {
    const item = mapEventDetail({ ...event, ends_at: null, location: null, floor: '3' })

    expect(item).toMatchObject({ when: '29 сентября', location: '3', register: false })
    expect(item?.program).toBeUndefined()
    expect(item?.bodyHtml).toBeUndefined()
  })

  it('без starts_at детальная не маппится', () => {
    expect(mapEventDetail({ ...event, starts_at: null })).toBeUndefined()
    expect(mapEventDetail(null)).toBeUndefined()
  })
})
