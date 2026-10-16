import { describe, expect, it, vi } from 'vitest'
import { createError } from 'h3'
import { proxyFormPost } from '../../server/utils/proxyFormPost'

const options = {
  baseURL: 'https://api.example.com/api/v1',
  timeout: 10_000,
  headers: { Accept: 'application/json' },
}

describe('proxyFormPost', () => {
  it('отправляет POST на upstream и возвращает тело', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ data: { id: 154 } })

    const body = await proxyFormPost<{ data: { id: number } }>(
      options,
      '/forms/feedback',
      { consent: true },
      fetchMock,
    )

    expect(body).toEqual({ data: { id: 154 } })
    expect(fetchMock).toHaveBeenCalledWith(
      '/forms/feedback',
      expect.objectContaining({
        method: 'POST',
        baseURL: options.baseURL,
        body: { consent: true },
      }),
    )
  })

  it('пробрасывает 422 с телом валидации', async () => {
    vi.stubGlobal('createError', createError)

    const fetchMock = vi.fn().mockRejectedValue({
      statusCode: 422,
      data: {
        message: 'Вы должны принять consent.',
        errors: { consent: ['Вы должны принять consent.'] },
      },
    })

    await expect(
      proxyFormPost(options, '/forms/feedback', { consent: false }, fetchMock),
    ).rejects.toMatchObject({
      statusCode: 422,
      data: {
        message: 'Вы должны принять consent.',
        errors: { consent: ['Вы должны принять consent.'] },
      },
    })

    vi.unstubAllGlobals()
  })
})
