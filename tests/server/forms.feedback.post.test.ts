import { afterEach, describe, expect, it, vi } from 'vitest'
import { createError, isError } from 'h3'

/**
 * Ручка Nitro формы обратной связи: тело проверяет контракт, запрос идёт в Laravel
 * клиентом записи, наружу уходит статус без тела upstream — кроме 422 с ошибками полей.
 */

type FeedbackHandler = (event: unknown) => Promise<unknown>
type RecordedOptions = { method?: string; body?: unknown }
type ThrownError = {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: unknown
}

const validBody = {
  consent: true,
  topic: 'general',
  name: 'Иван Иванов',
  phone: '+7 (499) 677-88-77',
  email: 'ivan@example.com',
  message: 'Здравствуйте',
}

let requestedPath = ''
let requestedOptions: RecordedOptions | undefined
let body: unknown = validBody
let upstream: () => Promise<unknown> = () => Promise.resolve({ data: { id: 154 } })

async function loadHandler(): Promise<FeedbackHandler> {
  vi.resetModules()
  requestedPath = ''
  requestedOptions = undefined
  body = validBody
  upstream = () => Promise.resolve({ data: { id: 154 } })

  vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)
  vi.stubGlobal('createError', createError)
  vi.stubGlobal('isError', isError)
  vi.stubGlobal('readBody', () => Promise.resolve(body))
  vi.stubGlobal('apiWriteFetch', () => (path: string, options?: RecordedOptions) => {
    requestedPath = path
    requestedOptions = options
    return upstream()
  })

  const module = await import('../../server/api/forms/feedback.post')
  return module.default as FeedbackHandler
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server/api/forms/feedback.post', () => {
  it('отправляет тело формы в Laravel и отдаёт ответ ручки', async () => {
    const handler = await loadHandler()

    const response = await handler({})

    expect(requestedPath).toBe('/forms/feedback')
    expect(requestedOptions).toEqual({ method: 'POST', body: validBody })
    expect(response).toEqual({ data: { id: 154 } })
  })

  it('передаёт заполненный хонейпот и не шлёт пустой', async () => {
    const handler = await loadHandler()

    body = { ...validBody, website_url: '' }
    await handler({})
    expect(requestedOptions?.body).toEqual(validBody)

    body = { ...validBody, website_url: 'http://spam' }
    await handler({})
    expect(requestedOptions?.body).toEqual({ ...validBody, website_url: 'http://spam' })
  })

  it('422 отдаёт браузеру телом полей, а текст держит в message', async () => {
    const handler = await loadHandler()

    upstream = () =>
      Promise.reject({
        statusCode: 422,
        data: {
          message: 'Вы должны принять consent.',
          errors: { consent: ['Вы должны принять consent.'] },
        },
      })

    const error = (await handler({}).catch((thrown: unknown) => thrown)) as ThrownError

    expect(error.statusCode).toBe(422)
    expect(error.message).toBe('Feedback form validation failed')
    expect(error.statusMessage).toBeUndefined()
    expect(error.data).toEqual({
      message: 'Вы должны принять consent.',
      errors: { consent: ['Вы должны принять consent.'] },
    })
  })

  it('500 upstream не отдаёт наружу тело и подробности', async () => {
    const handler = await loadHandler()

    upstream = () =>
      Promise.reject({
        statusCode: 500,
        data: { message: 'SQLSTATE[HY000]: connection refused', trace: 'app/Http/...' },
      })

    const error = (await handler({}).catch((thrown: unknown) => thrown)) as ThrownError

    expect(error.statusCode).toBe(500)
    expect(error.statusMessage).toBe('Feedback form API request failed')
    expect(error.data).toBeUndefined()
  })

  it('битое тело — 400, запрос в Laravel не уходит', async () => {
    const handler = await loadHandler()

    body = { ...validBody, topic: 'unknown' }
    const error = (await handler({}).catch((thrown: unknown) => thrown)) as ThrownError

    expect(error.statusCode).toBe(400)
    expect(error.statusMessage).toBe('Feedback topic is invalid')
    expect(requestedPath).toBe('')
  })

  it('не подменяет h3-ошибку настройки upstream', async () => {
    const handler = await loadHandler()

    upstream = () =>
      Promise.reject(
        createError({ statusCode: 503, statusMessage: 'API upstream is not configured' }),
      )

    const error = (await handler({}).catch((thrown: unknown) => thrown)) as ThrownError

    expect(error.statusCode).toBe(503)
    expect(error.statusMessage).toBe('API upstream is not configured')
  })
})
