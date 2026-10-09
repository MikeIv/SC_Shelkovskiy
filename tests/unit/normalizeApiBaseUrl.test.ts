import { describe, expect, it } from 'vitest'
import { joinApiUrl, normalizeApiBaseUrl } from '#shared/utils/normalizeApiBaseUrl'

describe('normalizeApiBaseUrl', () => {
  it('пустая строка и пробелы — не база (запросы идут на свой origin)', () => {
    expect(normalizeApiBaseUrl('')).toBeUndefined()
    expect(normalizeApiBaseUrl('   ')).toBeUndefined()
  })

  it('не строка — не база', () => {
    expect(normalizeApiBaseUrl(undefined)).toBeUndefined()
    expect(normalizeApiBaseUrl(null)).toBeUndefined()
    expect(normalizeApiBaseUrl(42)).toBeUndefined()
  })

  it('убирает пробелы и завершающие слэши', () => {
    expect(normalizeApiBaseUrl('  https://api.example.com/api/v1///  ')).toBe(
      'https://api.example.com/api/v1',
    )
  })
})

describe('joinApiUrl', () => {
  it('без базы оставляет путь от корня', () => {
    expect(joinApiUrl('', 'api/home')).toBe('/api/home')
    expect(joinApiUrl(undefined, '/api/home')).toBe('/api/home')
  })

  it('склеивает базу и путь без двойных слэшей', () => {
    expect(joinApiUrl('https://api.example.com/api/v1/', '/api/home')).toBe(
      'https://api.example.com/api/v1/api/home',
    )
  })
})
