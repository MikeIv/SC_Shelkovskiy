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
  maskPhone,
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
  it('принимает две части и инициалы', () => {
    expect(isFullName('Ли Су')).toBe(true)
    expect(isFullName('Иванов Иван Иванович')).toBe(true)
    expect(isFullName('Анна-Мария Петрова')).toBe(true)
    expect(isFullName('Иванов И.')).toBe(true)
    expect(isFullName('Иванов И.И.')).toBe(true)
    expect(isFullName('Ли С')).toBe(true)
  })

  it('отклоняет одну часть, одни инициалы и цифры', () => {
    expect(isFullName('Ли')).toBe(false)
    expect(isFullName('Анна-Мария')).toBe(false)
    expect(isFullName('И С')).toBe(false)
    expect(isFullName('Иван1 Петров')).toBe(false)
  })
})

describe('maskPersonName', () => {
  it('убирает цифры и лишние символы, поднимает первую букву', () => {
    expect(maskPersonName('ли су')).toBe('Ли су')
    expect(maskPersonName('иван2')).toBe('Иван')
    expect(maskPersonName('иван2 петров3')).toBe('Иван петров')
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

describe('maskPhone', () => {
  it('форматирует номер через +7 по мере ввода', () => {
    expect(maskPhone('9')).toBe('+7 (9')
    expect(maskPhone('999')).toBe('+7 (999')
    expect(maskPhone('9996')).toBe('+7 (999) 6')
    expect(maskPhone('9996778')).toBe('+7 (999) 677-8')
    expect(maskPhone('9996778888')).toBe('+7 (999) 677-88-88')
  })

  it('считает ведущие 8 и 7 кодом страны', () => {
    expect(maskPhone('89996778888')).toBe('+7 (999) 677-88-88')
    expect(maskPhone('79996778888')).toBe('+7 (999) 677-88-88')
    expect(maskPhone('+7 (999) 677-88-88')).toBe('+7 (999) 677-88-88')
  })

  it('отбрасывает буквы и лишние цифры', () => {
    expect(maskPhone('')).toBe('')
    expect(maskPhone('abc')).toBe('')
    expect(maskPhone('9a9b9')).toBe('+7 (999')
    expect(maskPhone('999677888812')).toBe('+7 (999) 677-88-88')
  })

  it('верный номер проходит проверку, неполный — нет', () => {
    expect(isPhone(maskPhone('9996778888'))).toBe(true)
    expect(isPhone(maskPhone('999677'))).toBe(false)
  })

  it('идемпотентна: лишние цифры сверх 10 не меняют значение', () => {
    const masked = maskPhone('89996778888')

    expect(maskPhone(masked)).toBe(masked)
    expect(maskPhone(`${masked}9`)).toBe(masked)
  })
})

describe('isHttpUrl', () => {
  it('принимает домен и http(s)', () => {
    expect(isHttpUrl('example.com')).toBe(true)
    expect(isHttpUrl('мой-сайт.рф')).toBe(true)
    expect(isHttpUrl('https://example.com/path')).toBe(true)
  })

  it('отклоняет текст без домена и битый хост', () => {
    expect(isHttpUrl('не сайт')).toBe(false)
    expect(isHttpUrl('example')).toBe(false)
    expect(isHttpUrl('example..com')).toBe(false)
    expect(isHttpUrl('example.com.')).toBe(false)
    expect(isHttpUrl('-example.com')).toBe(false)
    expect(isHttpUrl('12.34')).toBe(false)
    expect(isHttpUrl('user@example.com')).toBe(false)
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
