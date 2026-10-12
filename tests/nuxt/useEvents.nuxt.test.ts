import { describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import { eventsAfishaItems } from '~/data/eventsItems'
import { EventProbe, EventsProbe } from './support/EventsProbe'

const apiEvent = {
  id: 'concert',
  imageSrc: '',
  imageAlt: 'Концерт',
  dateStart: { day: '29', month: 'сентября' },
  tagLabel: 'Афиша',
  title: 'Концерт из API',
  description: 'Описание',
  to: '/events/concert',
}

const detail = {
  ...apiEvent,
  when: '29 сентября — 2 октября, 19:00',
  paragraphs: [],
  program: [{ time: '19:00–20:00', title: 'Открытие' }],
  register: true,
  bodyHtml: '<p>Текст из API</p>',
  seo: null,
}

describe('useEvents', () => {
  it('берёт афишу из API', async () => {
    registerEndpoint('/api/events', () => ({ data: { items: [apiEvent], meta: null } }))

    const wrapper = await mountSuspended(EventsProbe)

    expect(wrapper.attributes('data-count')).toBe('1')
    expect(wrapper.attributes('data-first')).toBe('Концерт из API')
    expect(wrapper.attributes('data-fallback')).toBe('false')
  })

  it('при ошибке upstream отдаёт мок афиши', async () => {
    registerEndpoint('/api/events', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(EventsProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-fallback')).toBe('true'))
    expect(wrapper.attributes('data-count')).toBe(String(eventsAfishaItems.length))
  })
})

describe('useEvent', () => {
  it('берёт детальную из API', async () => {
    registerEndpoint('/api/events/concert', () => ({ data: detail }))

    const wrapper = await mountSuspended(EventProbe, { props: { slug: 'concert' } })

    expect(wrapper.attributes('data-title')).toBe('Концерт из API')
    expect(wrapper.attributes('data-when')).toBe('29 сентября — 2 октября, 19:00')
    expect(wrapper.attributes('data-program')).toBe('1')
    expect(wrapper.attributes('data-register')).toBe('true')
    expect(wrapper.attributes('data-body')).toBe('<p>Текст из API</p>')
  })

  it('сброс данных оставляет детальную пустой, а не битой', async () => {
    registerEndpoint('/api/events/concert', () => ({ data: detail }))

    const wrapper = await mountSuspended(EventProbe, { props: { slug: 'concert' } })

    expect(wrapper.attributes('data-title')).toBe('Концерт из API')

    /**
     * Соседний пробник при монтировании сбрасывает данные Nuxt: демо-мероприятия
     * у `concert` нет, поэтому первый кадр обязан остаться пустым, а не битым.
     */
    registerEndpoint('/api/events/burova-dva-izmereniya', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })
    await mountSuspended(EventProbe, { props: { slug: 'burova-dva-izmereniya' } })
    await nextTick()

    expect(wrapper.attributes('data-title')).toBe('')
  })

  it('404 не подменяет моком', async () => {
    registerEndpoint('/api/events/missing', () => {
      throw createError({ statusCode: 404, statusMessage: 'Not found' })
    })

    const wrapper = await mountSuspended(EventProbe, { props: { slug: 'missing' } })

    expect(wrapper.attributes('data-title')).toBe('')
  })

  it('без upstream открывает мок по slug', async () => {
    registerEndpoint('/api/events/burova-dva-izmereniya', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(EventProbe, { props: { slug: 'burova-dva-izmereniya' } })

    expect(wrapper.attributes('data-title')).toBe(eventsAfishaItems[0]?.title)
    expect(wrapper.attributes('data-when')).toBe('1 июля — 2 августа')
  })
})
