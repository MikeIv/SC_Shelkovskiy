import { describe, expect, it, vi } from 'vitest'
import { createError, readBody } from 'h3'
import type { H3Event } from 'h3'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { FormProbe, feedbackPayload } from './support/FormProbe'

/**
 * Отправка формы в режиме прокси (`.env`: пустой `NUXT_PUBLIC_API_BASE`): клиент идёт
 * на свою ручку Nitro, а не на путь Laravel — его собирает контракт `feedbackMutation`.
 */
describe('useApiMutation', () => {
  it('шлёт POST на ручку Nitro с телом формы', async () => {
    let method = ''
    let received: unknown = null

    registerEndpoint('/api/forms/feedback', {
      method: 'POST',
      handler: async (event: H3Event) => {
        method = event.method
        received = await readBody(event)
        return { data: { id: 154 } }
      },
    })

    const wrapper = await mountSuspended(FormProbe)

    expect(wrapper.attributes('data-state')).toBe('idle')

    await wrapper.trigger('click')

    await vi.waitFor(() => expect(wrapper.attributes('data-state')).toBe('ok'))
    expect(method).toBe('POST')
    expect(received).toEqual(feedbackPayload)
  })

  it('показывает текст ошибки полей из ответа ручки', async () => {
    registerEndpoint('/api/forms/feedback', {
      method: 'POST',
      handler: () => {
        throw createError({
          statusCode: 422,
          message: 'Feedback form validation failed',
          data: { message: 'Вы должны принять consent.', errors: { consent: ['Нужно согласие'] } },
        })
      },
    })

    const wrapper = await mountSuspended(FormProbe)

    await wrapper.trigger('click')

    await vi.waitFor(() =>
      expect(wrapper.attributes('data-state')).toBe('Вы должны принять consent.'),
    )
  })
})
