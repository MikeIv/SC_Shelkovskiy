import { describe, expect, it } from 'vitest'
import { resolveAlt } from '#shared/utils/resolveAlt'

describe('resolveAlt', () => {
  it('возвращает пустую строку для декоративной картинки', () => {
    expect(resolveAlt(null)).toBe('')
    expect(resolveAlt(undefined)).toBe('')
    expect(resolveAlt('   ')).toBe('')
  })

  it('берёт подпись из заголовка и обрезает пробелы', () => {
    expect(resolveAlt('  Русалочка  ')).toBe('Русалочка')
  })

  it('не теряет символы внутри заголовка', () => {
    expect(resolveAlt('  Русалочка »©  ')).toBe('Русалочка »©')
  })
})
