import { describe, expect, it } from 'vitest'
import { buildApiFetchOptions } from '../../server/utils/apiFetch'

describe('buildApiFetchOptions', () => {
  it('собирает клиент из приватного runtimeConfig, а не из public.apiBase', () => {
    const options = buildApiFetchOptions({
      apiUpstream: 'https://api.example.com/api/v1/',
      apiAuth: 'dev:dev',
    })

    expect(options).toEqual({
      baseURL: 'https://api.example.com/api/v1',
      timeout: 10_000,
      headers: {
        Accept: 'application/json',
        Authorization: 'Basic ZGV2OmRldg==',
      },
    })
  })

  it('без кредов не ставит Authorization', () => {
    const options = buildApiFetchOptions({
      apiUpstream: 'https://api.example.com/api/v1',
      apiAuth: '',
    })

    expect(options.headers).toEqual({ Accept: 'application/json' })
  })

  it('503, если upstream не настроен', () => {
    expect(() => buildApiFetchOptions({ apiUpstream: '', apiAuth: '' })).toThrowError(
      expect.objectContaining({ statusCode: 503 }),
    )
    expect(() => buildApiFetchOptions({})).toThrowError(
      expect.objectContaining({ statusCode: 503 }),
    )
  })
})
