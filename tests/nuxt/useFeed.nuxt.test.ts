import { describe, expect, it, vi } from 'vitest'
import { createError, getQuery } from 'h3'
import type { H3Event } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { FeedProbe } from './support/FeedProbe'

const firstCard = {
  id: 'winter',
  imageSrc: '',
  imageAlt: 'Из API',
  date: '30 сентября',
  category: 'ТРЦ «Щёлковский»',
  title: 'Из API',
  tagLabel: 'Новость',
  tagVariant: 'news',
  to: '/news/winter',
}

const actionCard = {
  ...firstCard,
  id: 'sale',
  title: 'Акция из API',
  tagLabel: 'Акция',
  tagVariant: 'action',
}

const thirdCard = { ...firstCard, id: 'third', title: 'Третья карточка' }

describe('useFeed', () => {
  it('берёт первую страницу из API и догружает следующую по клику', async () => {
    registerEndpoint('/api/feed', (event: H3Event) => {
      const query = getQuery(event)

      if (String(query.page) === '2') {
        return {
          data: {
            items: [thirdCard],
            meta: { current_page: 2, last_page: 2, per_page: 2, total: 3 },
          },
        }
      }

      return {
        data: {
          items: [firstCard],
          meta: { current_page: 1, last_page: 2, per_page: 2, total: 3 },
        },
      }
    })

    const wrapper = await mountSuspended(FeedProbe)

    expect(wrapper.attributes('data-count')).toBe('1')
    expect(wrapper.attributes('data-first')).toBe('Из API')
    expect(wrapper.attributes('data-more')).toBe('true')
    expect(wrapper.attributes('data-fallback')).toBe('false')

    await wrapper.trigger('click')

    await vi.waitFor(() => expect(wrapper.attributes('data-count')).toBe('2'))
    expect(wrapper.attributes('data-last')).toBe('Третья карточка')
    expect(wrapper.attributes('data-more')).toBe('false')
  })

  it('вкладка уходит в type запроса', async () => {
    let requestedType = ''

    registerEndpoint('/api/feed', (event: H3Event) => {
      requestedType = String(getQuery(event).type)
      return { data: { items: [actionCard], meta: null } }
    })

    const wrapper = await mountSuspended(FeedProbe, { props: { tab: 'action' } })

    expect(requestedType).toBe('action')
    expect(wrapper.attributes('data-first')).toBe('Акция из API')
    expect(wrapper.attributes('data-more')).toBe('false')
  })

  it('при ошибке upstream отдаёт мок вкладки без пагинации', async () => {
    registerEndpoint('/api/feed', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(FeedProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-fallback')).toBe('true'))
    expect(wrapper.attributes('data-count')).toBe('6')
    expect(wrapper.attributes('data-first')).toBe('Подарочная карта ТРЦ «Щёлковский»')
    expect(wrapper.attributes('data-more')).toBe('false')
  })

  it('не дописывает страницу чужой вкладки, если вкладку переключили во время запроса', async () => {
    registerEndpoint('/api/feed', async (event: H3Event) => {
      const query = getQuery(event)

      if (query.type === 'action') {
        return { data: { items: [actionCard], meta: null } }
      }

      if (String(query.page) === '2') {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return {
          data: {
            items: [thirdCard],
            meta: { current_page: 2, last_page: 2, per_page: 2, total: 3 },
          },
        }
      }

      return {
        data: {
          items: [firstCard],
          meta: { current_page: 1, last_page: 2, per_page: 2, total: 3 },
        },
      }
    })

    const wrapper = await mountSuspended(FeedProbe, { props: { switchTo: 'action' } })

    expect(wrapper.attributes('data-count')).toBe('1')

    await wrapper.trigger('click')
    await wrapper.get('button').trigger('click')

    await vi.waitFor(() => expect(wrapper.attributes('data-first')).toBe('Акция из API'))
    await new Promise((resolve) => setTimeout(resolve, 150))

    expect(wrapper.attributes('data-count')).toBe('1')
    expect(wrapper.attributes('data-last')).toBe('Акция из API')
    expect(wrapper.attributes('data-more')).toBe('false')
  })
})
