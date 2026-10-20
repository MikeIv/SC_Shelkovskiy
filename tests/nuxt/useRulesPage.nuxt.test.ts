import { describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { RulesProbe } from './support/RulesProbe'

/** Уже смапленный ответ прокси: `documents` из блока CMS, SEO отдельно. */
const envelope = {
  data: {
    slug: 'rules',
    title: 'Правила',
    documents: [
      { title: 'Правила посещения', url: 'https://cdn.example/visit.pdf' },
      { title: 'Правила парковки', url: 'https://cdn.example/parking.pdf' },
    ],
    seo: {
      title: 'Правила ТРЦ «Щёлковский»',
      description: 'Документы с правилами',
      keywords: 'правила',
      ogImage: '',
    },
  },
}

describe('useRulesPage', () => {
  it('берёт документы из блока documents и SEO-заголовок ручки', async () => {
    registerEndpoint('/api/pages/rules', () => envelope)

    const wrapper = await mountSuspended(RulesProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-count')).toBe('2'))
    expect(wrapper.attributes('data-error')).toBe('false')
    expect(wrapper.attributes('data-first')).toBe('Правила посещения')
    expect(wrapper.attributes('data-href')).toBe('https://cdn.example/visit.pdf')
    expect(wrapper.attributes('data-title')).toBe('Правила')
    expect(wrapper.attributes('data-seo-title')).toBe('Правила ТРЦ «Щёлковский»')
    expect(wrapper.attributes('data-seo-keywords')).toBe('правила')
  })

  it('при ошибке ручки оставляет пустой список без мока и отдаёт заголовок по умолчанию', async () => {
    registerEndpoint('/api/pages/rules', () => {
      throw createError({ statusCode: 503, statusMessage: 'API upstream is not configured' })
    })

    const wrapper = await mountSuspended(RulesProbe)

    await vi.waitFor(() => expect(wrapper.attributes('data-error')).toBe('true'))
    expect(wrapper.attributes('data-count')).toBe('0')
    expect(wrapper.attributes('data-title')).toBe('Правила')
    expect(wrapper.attributes('data-seo-title')).toBe('Правила')
    expect(wrapper.attributes('data-seo-keywords')).toBe('')
  })
})
