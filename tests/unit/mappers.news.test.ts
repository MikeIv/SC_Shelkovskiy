import { describe, expect, it } from 'vitest'
import { mapFeedList, mapNewsDetail } from '#shared/utils/mappers/news'

const newsItem = {
  type: 'news',
  slug: 'winter',
  title: 'Зимняя коллекция',
  image: '/images/news.jpg',
  date: '2026-09-30',
  source: { kind: 'mall', name: 'ТРЦ «Щёлковский»' },
  url: '/news/winter',
}

const actionItem = {
  type: 'action',
  slug: 'sale',
  title: 'Скидки недели',
  image: '/images/sale.jpg',
  date: '2026-10-01',
  period: { from: '2026-10-01', to: '2026-10-31' },
  source: { kind: 'tenant', name: 'COLIN’S', slug: 'colins' },
  url: '/news/sale',
}

describe('mapFeedList', () => {
  it('маппит карточки и пагинацию', () => {
    const list = mapFeedList({
      data: [newsItem, actionItem],
      meta: { current_page: 1, last_page: 3, per_page: 12, total: 30 },
    })

    expect(list.items).toHaveLength(2)
    expect(list.items[0]).toMatchObject({
      id: 'winter',
      tagLabel: 'Новость',
      tagVariant: 'news',
      date: '30 сентября',
      category: 'ТРЦ «Щёлковский»',
      to: '/news/winter',
    })
    expect(list.items[1]).toMatchObject({ id: 'sale', tagLabel: 'Акция', date: 'до 31 октября' })
    expect(list.meta).toEqual({ current_page: 1, last_page: 3, per_page: 12, total: 30 })
  })

  it('без meta пагинации нет, нераспознанные элементы пропускаются', () => {
    const list = mapFeedList({ data: [newsItem, { title: 'Без slug' }] })

    expect(list.items).toHaveLength(1)
    expect(list.meta).toBeNull()
  })

  it('без url карточка остаётся без ссылки: чужой адрес ссылкой не становится', () => {
    const list = mapFeedList({ data: [{ ...newsItem, url: 'https://example.invalid/news' }] })

    expect(list.items[0]).not.toHaveProperty('to')
  })
})

describe('mapNewsDetail', () => {
  it('маппит текст, галерею, арендатора и seo', () => {
    const item = mapNewsDetail({
      ...newsItem,
      published_at: '2026-09-30',
      text: '<p>Абзац текста</p><script>bad()</script>',
      gallery: [' /images/1.jpg ', ''],
      tenant: {
        slug: 'colins',
        name: 'COLIN’S',
        logo: '/images/logo.png',
        floor: '3 этаж',
        map_url: '/map?tenant=colins',
      },
      seo: { title: 'Зимняя коллекция', description: 'Описание', keywords: null, og_image: null },
    })

    expect(item).toMatchObject({
      id: 'winter',
      publishedAt: '30 сентября 2026',
      publishedAtIso: '2026-09-30',
      gallery: ['/images/1.jpg'],
      bodyHtml: '<p>Абзац текста</p>',
      tenant: {
        logoSrc: '/images/logo.png',
        logoAlt: 'COLIN’S',
        floor: '3 этаж',
        mapUrl: '/map?tenant=colins',
      },
      seo: { title: 'Зимняя коллекция', description: 'Описание', keywords: '', ogImage: '' },
    })
  })

  it('у акции срок в чипе, пустая галерея без обложки остаётся пустой', () => {
    const item = mapNewsDetail({
      ...actionItem,
      image: '',
      text: '',
      gallery: [],
      published_at: null,
    })

    expect(item).toMatchObject({ period: '1 октября — 31 октября', seo: null })
    expect(item?.gallery).toBeUndefined()
    expect(item?.bodyHtml).toBeUndefined()
  })

  it('без галереи берёт обложку, без карточки — undefined', () => {
    expect(mapNewsDetail({ ...newsItem, gallery: [] })?.gallery).toEqual(['/images/news.jpg'])
    expect(mapNewsDetail({ ...newsItem, slug: '  ' })).toBeUndefined()
    expect(mapNewsDetail(null)).toBeUndefined()
  })
})
