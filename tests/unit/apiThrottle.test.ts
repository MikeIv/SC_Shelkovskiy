import { describe, expect, it } from 'vitest'
import type { RawApiClient } from '#shared/api/request'
import { asApiRequest } from '#shared/api/request'
import { throttleWaitMs, withThrottleRetry } from '#shared/api/throttle'

/**
 * Laravel режет запросы по IP (429 + `Retry-After`), а пререндер статики обходит сотни
 * страниц. Проверяем, что запрос повторяется после окна лимита и что чужие ошибки не глотаются.
 */

function throttled(retryAfter?: string): unknown {
  return {
    response: {
      status: 429,
      headers: new Headers(retryAfter === undefined ? {} : { 'retry-after': retryAfter }),
    },
  }
}

describe('throttleWaitMs', () => {
  it('берёт паузу из Retry-After, иначе — запасную', () => {
    expect(throttleWaitMs(throttled('31'))).toBe(31_250)
    expect(throttleWaitMs(throttled('0'))).toBe(250)
    expect(throttleWaitMs(throttled())).toBe(5_000)
  })

  it('не считает лимитом чужой статус и не-ошибку', () => {
    expect(throttleWaitMs({ response: { status: 500, headers: new Headers() } })).toBeNull()
    expect(throttleWaitMs(new Error('network'))).toBeNull()
    expect(throttleWaitMs(undefined)).toBeNull()
  })
})

describe('withThrottleRetry', () => {
  it('повторяет запрос после окна лимита и отдаёт данные', async () => {
    const startedAt: number[] = []
    let calls = 0
    const client: RawApiClient = () => {
      startedAt.push(Date.now())
      calls += 1

      return calls === 1 ? Promise.reject(throttled('1')) : Promise.resolve({ data: 'ok' })
    }

    const result = await withThrottleRetry(asApiRequest(client))<{ data: string }>('/feed')

    expect(result).toEqual({ data: 'ok' })
    expect(calls).toBe(2)
    expect(startedAt[1]! - startedAt[0]!).toBeGreaterThanOrEqual(1_000)
  })

  it('отдаёт исходную ошибку, когда попытки кончились', async () => {
    const error = throttled('0')
    let calls = 0
    const client: RawApiClient = () => {
      calls += 1

      return Promise.reject(error)
    }

    await expect(withThrottleRetry(asApiRequest(client), { maxAttempts: 2 })('/feed')).rejects.toBe(
      error,
    )
    expect(calls).toBe(2)
  })

  it('не повторяет ошибки, не связанные с лимитом', async () => {
    const error = { response: { status: 500, headers: new Headers() } }
    let calls = 0
    const client: RawApiClient = () => {
      calls += 1

      return Promise.reject(error)
    }

    await expect(withThrottleRetry(asApiRequest(client))('/feed')).rejects.toBe(error)
    expect(calls).toBe(1)
  })
})
