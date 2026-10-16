import { describe, expect, it } from 'vitest'
import type { ApiWriteOptions, ApiWriteRequest } from '#shared/api/request'
import { feedbackMutation, readFeedbackPayload } from '#shared/api/mutations'
import { ApiContractError } from '#shared/api/errors'
import type { FeedbackFormPayload } from '#shared/types/forms'

/**
 * Контракт мутации — общий код серверной ручки Nitro и клиента в прямом режиме,
 * поэтому проверяем чтение тела, путь у Laravel и метод запроса.
 */

type RecordedRequest = { path: string; options: ApiWriteOptions }

function fakeRequest(resolve: (path: string) => unknown): {
  request: ApiWriteRequest
  calls: RecordedRequest[]
} {
  const calls: RecordedRequest[] = []
  const request: ApiWriteRequest = <Dto>(path: string, options: ApiWriteOptions) => {
    calls.push({ path, options })
    return Promise.resolve(resolve(path)) as Promise<Dto>
  }

  return { request, calls }
}

const payload: FeedbackFormPayload = {
  consent: true,
  topic: 'general',
  name: 'Иван Иванов',
  phone: '+7 (499) 677-88-77',
  email: 'ivan@example.com',
  message: 'Здравствуйте',
}

describe('readFeedbackPayload', () => {
  it('принимает тело формы и не тащит лишние поля', () => {
    expect(readFeedbackPayload({ ...payload, unknown: 'x' })).toEqual(payload)
  })

  it('пропускает заполненный хонейпот и не шлёт пустой', () => {
    expect(readFeedbackPayload({ ...payload, website_url: '' })).toEqual(payload)
    expect(readFeedbackPayload({ ...payload, website_url: null })).toEqual(payload)
    expect(readFeedbackPayload({ ...payload, website_url: 'http://spam' })).toEqual({
      ...payload,
      website_url: 'http://spam',
    })
  })

  it('отбивает мусор 400 до обращения к API', () => {
    const broken: unknown[] = [
      null,
      'feedback',
      {},
      { ...payload, topic: 'other' },
      { ...payload, consent: 'yes' },
      { ...payload, email: 42 },
      { ...payload, website_url: 5 },
    ]

    for (const body of broken) {
      expect(() => readFeedbackPayload(body)).toThrowError(ApiContractError)
    }
  })
})

describe('feedbackMutation', () => {
  it('идёт POST на путь Laravel и отдаёт ответ как есть', async () => {
    const { request, calls } = fakeRequest(() => ({ data: { id: 154 } }))

    const body = await feedbackMutation.load(request, payload)

    expect(feedbackMutation.route).toBe('/api/forms/feedback')
    expect(feedbackMutation.method).toBe('POST')
    expect(calls).toEqual([{ path: '/forms/feedback', options: { method: 'POST', body: payload } }])
    expect(body).toEqual({ data: { id: 154 } })
  })

  it('читает тело той же проверкой, что и серверная ручка', () => {
    expect(feedbackMutation.payload({ ...payload, website_url: 'http://spam' })).toEqual({
      ...payload,
      website_url: 'http://spam',
    })
  })
})
