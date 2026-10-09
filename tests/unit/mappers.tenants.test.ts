import { describe, expect, it } from 'vitest'
import {
  mapCatalogCard,
  mapTenantDetail,
  mapTenantFilters,
  mapTenantsList,
} from '#shared/utils/mappers/tenants'

const shop = {
  id: 150,
  slug: 'colin-s',
  name: '  COLIN’S  ',
  type: 'shops',
  category: { slug: 'odezhda', name: 'Одежда' },
  floor: { id: 3, label: '3', name: '3 этаж' },
  podium: '318',
  logo: '  https://example.invalid/logo.jpg  ',
  image: 'https://example.invalid/image.jpg',
  status: 'new',
  tags: ['action', 'unknown', 'action'],
  breakfast: false,
  business_lunch: true,
  url: '/shops/colin-s',
}

describe('mapCatalogCard', () => {
  it('маппит карточку: логотип, этаж, известные теги и обед', () => {
    expect(mapCatalogCard(shop)).toEqual({
      id: '150',
      imageSrc: 'https://example.invalid/logo.jpg',
      imageAlt: 'COLIN’S',
      category: 'Одежда',
      categorySlug: 'odezhda',
      title: 'COLIN’S',
      floor: '3 этаж',
      status: 'new',
      podium: '318',
      tags: ['action', 'lunch'],
      to: '/shops/colin-s',
      mapUrl: '/map?tenant=colin-s',
      tenantId: 'colin-s',
    })
  })

  it('пропускает карточку без slug и оставляет пустой логотип', () => {
    expect(mapCatalogCard({ ...shop, slug: '  ' })).toBeUndefined()
    expect(mapCatalogCard({ ...shop, logo: null, tags: [], business_lunch: false })?.imageSrc).toBe(
      '',
    )
  })

  it('не кладёт внешний url в ссылку карточки', () => {
    expect(mapCatalogCard({ ...shop, url: 'https://example.invalid/shop' })?.to).toBe(
      '/shops/colin-s',
    )
  })
})

describe('mapTenantFilters', () => {
  it('берёт счётчики из meta и отбрасывает пункт без имени', () => {
    expect(
      mapTenantFilters({
        categories: [
          { slug: 'odezhda', name: 'Одежда', count: 29 },
          { slug: '', name: 'Пусто', count: 1 },
        ],
        floors: [
          { id: 1, name: '1 этаж', count: 41 },
          { id: 2, name: '  ', count: 3 },
        ],
      }),
    ).toEqual({
      categories: [{ value: 'odezhda', label: 'Одежда', count: 29 }],
      floors: [{ value: '1 этаж', label: '1 этаж', count: 41 }],
    })
  })
})

describe('mapTenantsList', () => {
  it('считает total по распознанным карточкам, без поля пагинации', () => {
    const list = mapTenantsList({
      data: [shop, { id: 1 }],
      meta: { filters: { categories: [], floors: [] } },
    })

    expect(list.total).toBe(1)
    expect(list.items).toHaveLength(1)
  })
})

describe('mapTenantDetail', () => {
  it('маппит HTML about, галерею, seo и новости', () => {
    const detail = mapTenantDetail(
      {
        ...shop,
        gallery: [' https://example.invalid/1.jpg ', ''],
        phone: '8-800-5555-585',
        website: 'befree.ru',
        about: '<p style="color:#fff" onclick="alert(1)">О бренде</p><script>bad()</script>',
        assortment: null,
        working_hours: [],
        map_url: '/map?tenant=colin-s',
        seo: {
          title: 'COLIN’S',
          description: 'Описание',
          keywords: null,
          og_image: 'https://example.invalid/og.jpg',
        },
      },
      [
        {
          id: 'sale',
          imageSrc: '/images/news.jpg',
          imageAlt: 'Акция',
          date: 'до 31 октября',
          category: 'COLIN’S',
          title: 'Скидка',
          tagLabel: 'Акция',
          tagVariant: 'action',
        },
      ],
    )

    expect(detail).toMatchObject({
      slug: 'colin-s',
      catalog: 'shops',
      phone: '8-800-5555-585',
      phoneHref: 'tel:88005555585',
      website: 'https://befree.ru',
      gallery: ['https://example.invalid/1.jpg'],
      status: 'new',
      podium: '318',
      assortment: null,
      workingHours: [],
      seo: {
        title: 'COLIN’S',
        description: 'Описание',
        keywords: '',
        ogImage: 'https://example.invalid/og.jpg',
      },
    })
    expect(detail?.about).toBe('<p>О бренде</p>')
    expect(detail?.news).toHaveLength(1)
  })

  it('не маппит чужой type', () => {
    expect(mapTenantDetail({ ...shop, type: 'mall' })).toBeUndefined()
  })

  it('берёт image в галерею, если списка фото нет', () => {
    expect(
      mapTenantDetail({ ...shop, gallery: [], image: 'https://example.invalid/cover.jpg' })
        ?.gallery,
    ).toEqual(['https://example.invalid/cover.jpg'])
  })
})
