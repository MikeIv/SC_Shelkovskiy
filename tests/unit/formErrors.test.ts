import { describe, expect, it } from 'vitest'
import { firstFieldError, readFormError } from '#shared/api/formErrors'

describe('readFormError', () => {
  it('читает errors из тела ofetch', () => {
    const error = {
      statusCode: 422,
      data: {
        message: 'Вы должны принять consent.',
        errors: { consent: ['Вы должны принять consent.'] },
      },
    }

    expect(readFormError(error)).toEqual({
      message: 'Вы должны принять consent.',
      errors: { consent: ['Вы должны принять consent.'] },
    })
    expect(firstFieldError(readFormError(error), 'consent')).toBe('Вы должны принять consent.')
  })

  it('разворачивает обёртку Nitro data.data', () => {
    const error = {
      statusCode: 422,
      data: {
        data: {
          message: 'Ошибка в полях',
          errors: { email: ['Must be a valid email address.'] },
        },
      },
    }

    expect(readFormError(error)?.errors?.email).toEqual(['Must be a valid email address.'])
  })

  it('возвращает null для неизвестного', () => {
    expect(readFormError(null)).toBeNull()
    expect(readFormError({ statusCode: 500 })).toBeNull()
  })
})
