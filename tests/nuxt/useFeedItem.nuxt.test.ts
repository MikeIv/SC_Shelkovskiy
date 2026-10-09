import { describe, expect, it } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { FeedItemProbe } from './support/FeedProbe'

const relatedCard = {
  id: 'other',
  imageSrc: '',
  imageAlt: 'Другая новость',
  date: '1 октября',
  category: 'ТРЦ «Щёлковский»',
  title: 'Другая новость',
  tagLabel: 'Новость',
  tagVariant: 'news',
  to: '/news/other',
}

const detail = {
  ...relatedCard,
  id: 'winter',
  title: 'Из API',
  publishedAt: '30 сентября 2026',
  bodyHtml: '<p>Текст из API</p>',
  gallery: [],
  seo: null,
}

describe('useFeedItem', () => {
  it('берёт детальную и связанные из API', async () => {
    registerEndpoint('/api/feed/winter', () => ({
      data: { item: detail, related: [relatedCard] },
    }))

    const wrapper = await mountSuspended(FeedItemProbe, { props: { slug: 'winter' } })

    expect(wrapper.attributes('data-title')).toBe('Из API')
    expect(wrapper.attributes('data-body')).toBe('<p>Текст из API</p>')
    expect(wrapper.attributes('data-related')).toBe('1')
    expect(wrapper.attributes('data-kind')).toBe('news')
  })

  it('404 не подменяет моком', async () => {
    registerEndpoint('/api/feed/missing', () => {
      throw createError({ statusCode: 404, statusMessage: 'Not found' })
    })

    const wrapper = await mountSuspended(FeedItemProbe, { props: { slug: 'missing' } })

    expect(wrapper.attributes('data-title')).toBe('')
    expect(wrapper.attributes('data-related')).toBe('0')
  })

  it('без upstream открывает мок по slug и связанные мока', async () => {
    registerEndpoint('/api/feed/gift-card', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(FeedItemProbe, { props: { slug: 'gift-card' } })

    expect(wrapper.attributes('data-title')).toBe('Подарочная карта ТРЦ «Щёлковский»')
    expect(wrapper.attributes('data-related')).toBe('4')
    expect(wrapper.attributes('data-kind')).toBe('news')
  })
})
