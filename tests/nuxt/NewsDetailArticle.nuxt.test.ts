import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { NewsDetailItem } from '#shared/types/news'
import { API_IMAGE_HOST } from '#shared/utils/apiImageHost'
import NewsDetailArticle from '~/components/news/DetailArticle.vue'

const base: NewsDetailItem = {
  id: 'winter',
  imageSrc: '',
  imageAlt: 'Зимняя коллекция',
  date: '30 сентября',
  category: 'ТРЦ «Щёлковский»',
  title: 'Зимняя коллекция',
  tagLabel: 'Новость',
  tagVariant: 'news',
}

/** Картинка стенда: URL с этого хоста проходит через ipx, любой другой модуль отдаёт как есть. */
function apiImage(path: string): string {
  return `https://${API_IMAGE_HOST}/storage/${path}`
}

describe('NewsDetailArticle — текст записи', () => {
  it('выводит структуру мока, когда HTML из CMS нет', async () => {
    const wrapper = await mountSuspended(NewsDetailArticle, {
      props: {
        item: {
          ...base,
          intro: ['Первый абзац мока'],
          sections: [
            { heading: 'Главные преимущества:', list: ['Пункт списка'] },
            { paragraphs: ['Абзац секции'], quote: 'Цитата секции' },
          ],
        },
      },
    })

    expect(wrapper.text()).toContain('Первый абзац мока')
    expect(wrapper.text()).toContain('Главные преимущества:')
    expect(wrapper.text()).toContain('Пункт списка')
    expect(wrapper.text()).toContain('Цитата секции')
  })

  it('с HTML из CMS структуру мока не показывает', async () => {
    const wrapper = await mountSuspended(NewsDetailArticle, {
      props: {
        item: {
          ...base,
          bodyHtml: '<p>Текст из CMS</p>',
          intro: ['Скрытый абзац'],
          sections: [{ heading: 'Скрытый заголовок' }],
        },
      },
    })

    expect(wrapper.text()).toContain('Текст из CMS')
    expect(wrapper.text()).not.toContain('Скрытый абзац')
    expect(wrapper.text()).not.toContain('Скрытый заголовок')
  })

  it('картинки API отдаёт через ipx', async () => {
    const wrapper = await mountSuspended(NewsDetailArticle, {
      props: {
        item: {
          ...base,
          imageSrc: apiImage('news/cover.jpg'),
          gallery: [apiImage('news/gallery-1.jpg')],
          tenant: {
            logoSrc: apiImage('shops/logo.png'),
            logoAlt: 'Тестовый магазин',
            floor: '1 этаж',
            mapUrl: '/map?tenant=test-shop',
          },
        },
      },
    })

    const sources = wrapper.findAll('img').map((image) => image.attributes('src') ?? '')

    expect(sources.length).toBeGreaterThan(1)
    for (const src of sources) {
      expect(src).toContain('/_ipx/')
    }
  })
})
