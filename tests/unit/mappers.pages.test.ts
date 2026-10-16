import { describe, expect, it } from 'vitest'
import type { PageResponseDto } from '#shared/types/dto/pages'
import { mapPage } from '#shared/utils/mappers/pages'

const baseDto: PageResponseDto = {
  data: {
    slug: 'contacts',
    title: 'Контакты',
    blocks: [],
    seo: { title: null, description: null, keywords: null, og_image: null },
  },
}

describe('mapPage', () => {
  it('маппит title и seo, а пустой seo отдаёт null', () => {
    expect(mapPage(baseDto)).toEqual({
      slug: 'contacts',
      title: 'Контакты',
      seo: null,
      form: null,
      mapRoute: null,
    })
  })

  it('берёт первый блок form и map_route, пропускает неизвестные типы', () => {
    const mapped = mapPage({
      data: {
        ...baseDto.data,
        title: ' Контакты ',
        blocks: [
          { id: 'text-0', type: 'text', data: { html: '<p>x</p>', title: 'T' } },
          {
            id: 'form-1',
            type: 'form',
            data: {
              kind: 'feedback',
              title: ' Написать нам ',
              description: ' Описание ',
            },
          },
          {
            id: 'map-1',
            type: 'map_route',
            data: {
              address: ' Москва, Щёлковское шоссе, 75 ',
              coordinates: ['37,80108', 55.810966],
              modes: [],
            },
          },
          {
            id: 'form-2',
            type: 'form',
            data: { kind: 'lease', title: 'Аренда', description: null },
          },
          { id: 'bad', type: 'form', data: { kind: 'unknown', title: 'X' } },
        ],
        seo: {
          title: 'SEO контакты',
          description: 'Описание',
          keywords: null,
          og_image: 'https://cdn.example/og.jpg',
        },
      },
    })

    expect(mapped).toEqual({
      slug: 'contacts',
      title: 'Контакты',
      seo: {
        title: 'SEO контакты',
        description: 'Описание',
        keywords: '',
        ogImage: 'https://cdn.example/og.jpg',
      },
      form: {
        kind: 'feedback',
        title: 'Написать нам',
        description: 'Описание',
      },
      mapRoute: {
        address: 'Москва, Щёлковское шоссе, 75',
        coordinates: [37.80108, 55.810966],
      },
    })
  })
})
