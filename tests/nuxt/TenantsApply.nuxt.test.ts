import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { tenantsApply, tenantsTradeProfiles } from '~/data/tenantsPage'
import TenantsApply from '~/components/tenants/Apply.vue'

function mountApply() {
  return mountSuspended(TenantsApply, {
    props: { ...tenantsApply, tradeProfiles: tenantsTradeProfiles },
  })
}

function fieldValue(field: { element: Element }): string {
  return (field.element as HTMLInputElement).value
}

describe('TenantsApply — маска телефона', () => {
  it('принимает только цифры и собирает номер через +7', async () => {
    const wrapper = await mountApply()
    const phone = wrapper.find('input[name="phone"]')

    await phone.setValue('abc')
    expect(fieldValue(phone)).toBe('')

    await phone.setValue('89996778888')
    expect(fieldValue(phone)).toBe('+7 (999) 677-88-88')

    await phone.setValue('+7 (999) 677-88-88')
    expect(fieldValue(phone)).toBe('+7 (999) 677-88-88')
  })

  it('не оставляет в поле лишние цифры после насыщения маски', async () => {
    const wrapper = await mountApply()
    const phone = wrapper.find('input[name="phone"]')

    await phone.setValue('9996778888')
    expect(fieldValue(phone)).toBe('+7 (999) 677-88-88')

    await phone.setValue('+7 (999) 677-88-889')
    expect(fieldValue(phone)).toBe('+7 (999) 677-88-88')
  })
})

describe('TenantsApply — маска ФИО', () => {
  it('отбрасывает цифры и недопустимые символы', async () => {
    const wrapper = await mountApply()
    const name = wrapper.find('input[name="fullName"]')

    await name.setValue('Иван1 Петров')
    expect(fieldValue(name)).toBe('Иван Петров')

    await name.setValue('Иван Петров№')
    expect(fieldValue(name)).toBe('Иван Петров')
  })
})

describe('TenantsApply — обязательные поля', () => {
  it('по отправке пустой формы подсвечивает поля и согласия', async () => {
    const wrapper = await mountApply()

    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Обязательное поле')
      expect(wrapper.find('input[name="phone"]').attributes('aria-invalid')).toBe('true')
    })
  })

  it('на заполненную заявку ошибок не выставляет', async () => {
    const wrapper = await mountApply()

    await wrapper.find('input[name="fullName"]').setValue('Иванов Иван')
    await wrapper.find('input[name="phone"]').setValue('9996778888')
    await wrapper.find('input[name="email"]').setValue('ivan@example.com')

    // Чекбоксы торговых профилей идут раньше согласий, поэтому ищем по тексту подписи.
    function consentInput(text: string) {
      const label = wrapper.findAll('label').find((item) => item.text().includes(text))

      return label!.find('input[type="checkbox"]')
    }

    await consentInput('Я даю согласие').setValue(true)
    await consentInput('Я ознакомлен').setValue(true)

    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(wrapper.findAll('[aria-invalid="true"]')).toHaveLength(0)
      expect(wrapper.text()).not.toContain('Обязательное поле')
    })
  })
})
