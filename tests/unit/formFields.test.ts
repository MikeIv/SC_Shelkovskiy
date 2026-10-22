import { describe, expect, it } from 'vitest'
import {
  isFullName,
  isHttpUrl,
  isNonNegativeInt,
  isNonNegativeIntChars,
  isPersonName,
  isPersonNameChars,
  isPhone,
  isPhoneChars,
  isPositiveAmount,
  isPositiveAmountChars,
  maskPersonName,
  parsePositiveAmount,
} from '#shared/utils/formFields'

describe('isPersonName', () => {
  it('принимает ФИО из букв', () => {
    expect(isPersonName('Иванов Иван Иванович')).toBe(true)
    expect(isPersonName('Анна-Мария')).toBe(true)
    expect(isPersonName("O'Brien")).toBe(true)
  })

  it('отклоняет цифры и пустую строку', () => {
    expect(isPersonNameChars('Иван1')).toBe(false)
    expect(isPersonName('Иван1')).toBe(false)
    expect(isPersonName('   ')).toBe(false)
    expect(isPersonName('---')).toBe(false)
  })
})

describe('isFullName', () => {
  it('принимает минимум две части по две буквы', () => {
    expect(isFullName('Ли Су')).toBe(true)
    expect(isFullName('Иванов Иван Иванович')).toBe(true)
    expect(isFullName('Анна-Мария Петрова')).toBe(true)
  })

  it('отклоняет одну часть и части короче двух букв', () => {
    expect(isFullName('Ли')).toBe(false)
    expect(isFullName('И Су')).toBe(false)
    expect(isFullName('Ли С')).toBe(false)
    expect(isFullName('Анна-Мария')).toBe(false)
    expect(isFullName('Иван1 Петров')).toBe(false)
  })
})

describe('maskPersonName', () => {
  it('убирает цифры и поднимает первую букву', () => {
    expect(maskPersonName('ли су')).toBe('Ли су')
    expect(maskPersonName('иван2')).toBe('Иван')
    expect(maskPersonName('123')).toBe('')
    expect(maskPersonName('Ли Су')).toBe('Ли Су')
  })
})

describe('isPhone', () => {
  it('принимает 10 цифр и 11 с 7 или 8', () => {
    expect(isPhone('+7 (499) 677-88-88')).toBe(true)
    expect(isPhone('8 499 677 88 88')).toBe(true)
    expect(isPhone('4996778888')).toBe(true)
  })

  it('отклоняет буквы и неполные номера', () => {
    expect(isPhoneChars('499abc')).toBe(false)
    expect(isPhone('499abc')).toBe(false)
    expect(isPhone('+7 499')).toBe(false)
    expect(isPhone('99912345678')).toBe(false)
  })
})

describe('isHttpUrl', () => {
  it('принимает домен и http(s)', () => {
    expect(isHttpUrl('example.com')).toBe(true)
    expect(isHttpUrl('https://example.com/path')).toBe(true)
  })

  it('отклоняет текст без домена', () => {
    expect(isHttpUrl('не сайт')).toBe(false)
    expect(isHttpUrl('example')).toBe(false)
  })
})

describe('числа формы', () => {
  it('количество магазинов — целое без ведущих нулей', () => {
    expect(isNonNegativeInt('0')).toBe(true)
    expect(isNonNegativeInt('12')).toBe(true)
    expect(isNonNegativeInt('01')).toBe(false)
    expect(isNonNegativeIntChars('12a')).toBe(false)
  })

  it('площадь — положительное число', () => {
    expect(isPositiveAmount('10')).toBe(true)
    expect(isPositiveAmount('10,5')).toBe(true)
    expect(isPositiveAmount('10.5')).toBe(true)
    expect(isPositiveAmount('0')).toBe(false)
    expect(isPositiveAmount('10.')).toBe(false)
    expect(isPositiveAmountChars('12м')).toBe(false)
    expect(parsePositiveAmount('10,5')).toBe(10.5)
    expect(parsePositiveAmount('0')).toBeNull()
  })
})
