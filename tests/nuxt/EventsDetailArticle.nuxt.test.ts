import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { API_IMAGE_HOST } from '#shared/utils/apiImageHost'
import EventsDetailArticle from '~/components/events/DetailArticle.vue'
import { EventsCtaProbe } from './support/EventsProbe'

const item = {
  id: 'concert',
  imageSrc: '',
  imageAlt: 'Концерт в атриуме',
  dateStart: { day: '29', month: 'сентября' },
  tagLabel: 'Афиша',
  title: 'Концерт в атриуме',
  description: '',
  when: '29 сентября',
  paragraphs: [],
  register: true,
}

function dialogOf(): HTMLElement | null {
  return document.body.querySelector('[role="dialog"]')
}

async function openPopup(wrapper: VueWrapper): Promise<void> {
  const button = wrapper
    .findAll('button')
    .find((candidate) => candidate.text().includes('Зарегистрироваться'))

  expect(button).toBeTruthy()

  await button?.trigger('click')
  await nextTick()
}

describe('EventsDetailArticle — попап регистрации', () => {
  it('берёт заголовок, описание и ссылку из cta_max', async () => {
    const wrapper = await mountSuspended(EventsCtaProbe, {
      props: {
        item,
        cta: {
          url: 'https://max.ru/test',
          title: 'Из cta_max',
          description: 'Описание из админки',
          imageSrc: '',
          imageAlt: '',
        },
      },
    })

    await openPopup(wrapper)

    const dialog = dialogOf()
    expect(dialog?.textContent).toContain('Из cta_max')
    expect(dialog?.textContent).toContain('Описание из админки')
    expect(dialog?.querySelector('a')?.getAttribute('href')).toBe('https://max.ru/test')

    wrapper.unmount()
  })

  it('без cta_max оставляет мок попапа', async () => {
    const wrapper = await mountSuspended(EventsCtaProbe, { props: { item, cta: null } })

    await openPopup(wrapper)

    const dialog = dialogOf()
    expect(dialog?.textContent).toContain('Узнай первым')
    expect(dialog?.querySelector('a')?.getAttribute('href')).toBe('https://max.ru')

    wrapper.unmount()
  })
})

describe('EventsDetailArticle — текст мероприятия', () => {
  it('выводит абзацы мока, когда HTML из CMS нет', async () => {
    const wrapper = await mountSuspended(EventsDetailArticle, {
      props: { item: { ...item, paragraphs: ['Абзац мероприятия'] } },
    })

    expect(wrapper.text()).toContain('Абзац мероприятия')
  })

  it('с HTML из CMS абзацы мока не показывает', async () => {
    const wrapper = await mountSuspended(EventsDetailArticle, {
      props: {
        item: { ...item, paragraphs: ['Скрытый абзац'], bodyHtml: '<p>Текст из CMS</p>' },
      },
    })

    expect(wrapper.text()).toContain('Текст из CMS')
    expect(wrapper.text()).not.toContain('Скрытый абзац')
  })

  it('картинку API отдаёт через ipx', async () => {
    const wrapper = await mountSuspended(EventsDetailArticle, {
      props: {
        item: {
          ...item,
          imageSrc: `https://${API_IMAGE_HOST}/storage/events/event.jpg`,
        },
      },
    })

    const image = wrapper.find('img')

    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toContain('/_ipx/')
  })
})
