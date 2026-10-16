import { describe, expect, it } from 'vitest'
import type { LayoutData } from '#shared/types/layout'
import type { LayoutResponseDto } from '#shared/types/dto/layout'
import { groupWeekRanges } from '#shared/utils/groupWeekRanges'
import { layoutTodayLabel } from '#shared/utils/layoutHours'
import { mapLayout } from '#shared/utils/mappers/layout'
import { resolveLayoutView } from '#shared/utils/resolveLayout'

const emptyDto: LayoutResponseDto = {
  data: {
    contacts: {
      address: null,
      metro: null,
      phone: null,
      email: null,
      departments: [],
    },
    hours: {
      timezone: 'Europe/Moscow',
      week: [],
      exceptions: [],
      tenants: [],
    },
    socials: [],
    apps: { app_store: null, google_play: null, rustore: null },
    cta_max: { url: null, title: null, description: null, image: null },
  },
}

const fallback: LayoutData = {
  contacts: {
    address: 'Адрес мока',
    metro: 'Щёлковская',
    phone: '+7 (499) 000-00-00',
    phoneHref: 'tel:+74990000000',
    email: 'mock@example.com',
    emailHref: 'mailto:mock@example.com',
    departments: [],
  },
  hours: {
    timezone: 'Europe/Moscow',
    week: [
      { index: 0, label: 'Пн', open: '10:00', close: '22:00' },
      { index: 1, label: 'Вт', open: '10:00', close: '22:00' },
      { index: 2, label: 'Ср', open: '10:00', close: '22:00' },
      { index: 3, label: 'Чт', open: '10:00', close: '22:00' },
      { index: 4, label: 'Пт', open: '10:00', close: '23:00' },
      { index: 5, label: 'Сб', open: '10:00', close: '23:00' },
      { index: 6, label: 'Вс', open: '10:00', close: '22:00' },
    ],
    exceptions: [],
    tenants: [{ name: 'Мок', ranges: [{ label: 'Пн-Вс', open: '09:00', close: '21:00' }] }],
  },
  socials: [
    {
      label: 'Сайт',
      href: 'https://example.com',
      icon: 'local:social-globe',
      iconSrc: null,
    },
  ],
  apps: [],
  ctaMax: null,
}

describe('mapLayout', () => {
  it('оставляет пустые контакты и неделю, а известную соцсеть сажает на локальную иконку', () => {
    const mapped = mapLayout({
      ...emptyDto,
      data: {
        ...emptyDto.data,
        socials: [
          {
            name: ' Вконтакте ',
            url: 'https://vk.com/public182014091',
            icon: 'https://cdn.example/vk.svg',
          },
          { name: 'Dzen', url: 'https://dzen.ru/id/1', icon: 'https://cdn.example/dzen.svg' },
          { name: 'javascript', url: 'javascript:alert(1)', icon: '/icon.svg' },
        ],
      },
    })

    expect(mapped.contacts.phone).toBe('')
    expect(mapped.hours.week).toEqual([])
    expect(mapped.socials).toEqual([
      {
        label: 'Вконтакте',
        href: 'https://vk.com/public182014091',
        icon: 'local:social-vk',
        iconSrc: null,
        hoverColor: '#0077ff',
      },
      {
        label: 'Dzen',
        href: 'https://dzen.ru/id/1',
        icon: 'local:social-dzen',
        iconSrc: null,
      },
    ])
  })

  it('сажает MAX и Дзен на локальные иконки без цвета бренда, а незнакомую сеть — на картинку', () => {
    const mapped = mapLayout({
      ...emptyDto,
      data: {
        ...emptyDto.data,
        socials: [
          {
            name: 'Max',
            url: 'https://max.ru/trc_schelkovsky',
            icon: 'https://cdn.example/max.svg',
          },
          { name: 'Дзен', url: 'https://dzen.ru/id/1', icon: 'https://cdn.example/dzen.svg' },
          { name: 'Threads', url: 'https://threads.net/@trc', icon: 'https://cdn.example/t.svg' },
        ],
      },
    })

    /** `hoverColor` не проставляем: у обеих иконок ховер как у MAX — цвет подвала по умолчанию. */
    expect(mapped.socials).toEqual([
      {
        label: 'Max',
        href: 'https://max.ru/trc_schelkovsky',
        icon: 'local:social-max',
        iconSrc: null,
      },
      { label: 'Дзен', href: 'https://dzen.ru/id/1', icon: 'local:social-dzen', iconSrc: null },
      {
        label: 'Threads',
        href: 'https://threads.net/@trc',
        icon: null,
        iconSrc: 'https://cdn.example/t.svg',
      },
    ])
  })

  it('собирает неделю по day 1…7 и пропускает чужие объекты', () => {
    const mapped = mapLayout({
      ...emptyDto,
      data: {
        ...emptyDto.data,
        hours: {
          timezone: ' Europe/Moscow ',
          week: [
            { day: 1, open: '10:00', close: '22:00' },
            { day: '7', from: '10:00', to: '22:00' },
            { day: 3 },
            { foo: 'bar' },
          ],
          exceptions: [{ date: '2026-01-01', closed: true }, { date: 'завтра' }],
          tenants: [
            {
              name: 'Перекресток',
              ranges: [{ label: 'Пн-Вс', open: '07:00', close: '23:00' }],
            },
            { title: 'Без часов' },
          ],
        },
        contacts: {
          ...emptyDto.data.contacts,
          phone: '+7 (499) 677-44-44',
          email: 'info@schelkovsky-trc.ru',
          departments: [
            { name: 'Аренда', phone: '+7 (499) 111-11-11', email: 'a@b.c', ext: '5151' },
          ],
        },
        apps: {
          app_store: 'https://apps.apple.com/app/id1',
          google_play: null,
          rustore: 'not a url',
        },
        cta_max: {
          url: 'https://max.ru/trc',
          title: 'MAX',
          description: null,
          image: null,
        },
      },
    })

    expect(mapped.hours.timezone).toBe('Europe/Moscow')
    expect(mapped.hours.week.map((day) => day.index)).toEqual([0, 6])
    expect(mapped.hours.exceptions).toEqual([
      { date: '2026-01-01', open: '', close: '', closed: true },
    ])
    expect(mapped.hours.tenants).toEqual([
      { name: 'Перекресток', ranges: [{ label: 'Пн-Вс', open: '07:00', close: '23:00' }] },
    ])
    expect(mapped.contacts.phoneHref).toBe('tel:+74996774444')
    expect(mapped.contacts.emailHref).toBe('mailto:info@schelkovsky-trc.ru')
    expect(mapped.contacts.departments[0]).toMatchObject({
      id: 'department-0',
      title: 'Аренда',
      phoneExt: '(5151)',
    })
    expect(mapped.apps).toEqual([
      { id: 'app-store', label: 'App Store', href: 'https://apps.apple.com/app/id1' },
    ])
    expect(mapped.ctaMax).toMatchObject({
      url: 'https://max.ru/trc',
      title: 'MAX',
      imageAlt: 'MAX',
    })
  })

  it('маппит отделы как в админке: код → id, title/name, ext с пробелами', () => {
    const mapped = mapLayout({
      ...emptyDto,
      data: {
        ...emptyDto.data,
        contacts: {
          address: '107207 Москва, Щёлковское шоссе, 75',
          metro: 'Щёлковская',
          phone: '+7 (499) 677-44-44',
          email: 'info@schelkovsky-trc.ru',
          departments: [
            {
              id: 'lease',
              title: 'Аренда',
              phone: '+7 (499) 677-88-88 ',
              ext: '5151',
              email: 'arenda@schelkovsky-trc.ru',
            },
            {
              id: 'ads',
              title: 'Реклама',
              phone: '+7 (499) 677-88-88',
              ext: ' 4779',
              email: 'reklama@schelkovsky-trc.ru',
            },
            {
              code: 'press',
              name: 'Для СМИ',
              phone: '+7 (499) 677-88-88',
              extension: '5181',
              email: 'pr@schelkovsky-trc.ru',
            },
          ],
        },
      },
    })

    expect(mapped.contacts).toMatchObject({
      address: '107207 Москва, Щёлковское шоссе, 75',
      metro: 'Щёлковская',
      phone: '+7 (499) 677-44-44',
      phoneHref: 'tel:+74996774444',
      email: 'info@schelkovsky-trc.ru',
    })
    expect(mapped.contacts.departments).toEqual([
      {
        id: 'lease',
        title: 'Аренда',
        phone: '+7 (499) 677-88-88',
        phoneHref: 'tel:+74996778888',
        phoneExt: '(5151)',
        email: 'arenda@schelkovsky-trc.ru',
        emailHref: 'mailto:arenda@schelkovsky-trc.ru',
      },
      {
        id: 'ads',
        title: 'Реклама',
        phone: '+7 (499) 677-88-88',
        phoneHref: 'tel:+74996778888',
        phoneExt: '(4779)',
        email: 'reklama@schelkovsky-trc.ru',
        emailHref: 'mailto:reklama@schelkovsky-trc.ru',
      },
      {
        id: 'press',
        title: 'Для СМИ',
        phone: '+7 (499) 677-88-88',
        phoneHref: 'tel:+74996778888',
        phoneExt: '(5181)',
        email: 'pr@schelkovsky-trc.ru',
        emailHref: 'mailto:pr@schelkovsky-trc.ru',
      },
    ])
  })
})

describe('resolveLayoutView', () => {
  it('подставляет мок, если неделя неполная, и оставляет соцсети стенда', () => {
    const api = mapLayout({
      ...emptyDto,
      data: {
        ...emptyDto.data,
        hours: {
          ...emptyDto.data.hours,
          week: [{ day: 1, open: '09:00', close: '18:00' }],
        },
        socials: [
          { name: 'Dzen', url: 'https://dzen.ru/id/1', icon: 'https://cdn.example/dzen.svg' },
        ],
      },
    })

    const view = resolveLayoutView(api, fallback)

    expect(view.socials[0]?.label).toBe('Dzen')
    expect(view.contacts.address).toBe('Адрес мока')
    expect(view.hours.week).toHaveLength(7)
    expect(view.hours.tenants[0]?.name).toBe('Мок')
  })

  it('добирает из мока ссылки на приложения, которых нет на стенде', () => {
    const fallbackWithApps: LayoutData = {
      ...fallback,
      apps: [
        { id: 'app-store', label: 'App Store', href: '#app-store' },
        { id: 'google-play', label: 'Google Play', href: '#google-play' },
        { id: 'rustore', label: 'RuStore', href: '#rustore' },
      ],
    }

    const api = mapLayout({
      ...emptyDto,
      data: {
        ...emptyDto.data,
        apps: { app_store: 'https://apps.apple.com/app/id1', google_play: null, rustore: null },
      },
    })

    expect(resolveLayoutView(api, fallbackWithApps).apps).toEqual([
      { id: 'app-store', label: 'App Store', href: 'https://apps.apple.com/app/id1' },
      { id: 'google-play', label: 'Google Play', href: '#google-play' },
      { id: 'rustore', label: 'RuStore', href: '#rustore' },
    ])
  })
})

describe('groupWeekRanges', () => {
  it('склеивает одинаковые интервалы, включая воскресенье к будням', () => {
    expect(groupWeekRanges(fallback.hours.week)).toEqual([
      { id: '10:00-22:00-0', days: 'ПН-ЧТ, ВС', time: '10:00 - 22:00' },
      { id: '10:00-23:00-4', days: 'ПТ-СБ', time: '10:00 - 23:00' },
    ])
  })
})

describe('layoutTodayLabel', () => {
  it('исключение на сегодня важнее обычной недели', () => {
    const hours: LayoutData['hours'] = {
      ...fallback.hours,
      exceptions: [{ date: '2026-10-09', open: '', close: '', closed: true }],
    }

    expect(layoutTodayLabel(hours, new Date('2026-10-09T12:00:00+03:00'))).toBe('Сегодня закрыто')
  })
})
