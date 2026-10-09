import { describe, expect, it } from 'vitest'
import { basicAuthorization } from '#shared/utils/basicAuthorization'

describe('basicAuthorization', () => {
  it('без кредов заголовок не ставится', () => {
    expect(basicAuthorization('')).toBeUndefined()
    expect(basicAuthorization('   ')).toBeUndefined()
    expect(basicAuthorization(undefined)).toBeUndefined()
  })

  it('собирает Basic из login:password', () => {
    expect(basicAuthorization('dev:dev')).toBe('Basic ZGV2OmRldg==')
    expect(basicAuthorization(' dev:dev ')).toBe('Basic ZGV2OmRldg==')
  })
})
