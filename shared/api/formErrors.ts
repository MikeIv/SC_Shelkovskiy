import type { ApiError, ApiFieldErrors } from '#shared/types/api'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asFieldErrors(value: unknown): ApiFieldErrors | undefined {
  if (!isRecord(value)) return undefined

  const errors: ApiFieldErrors = {}

  for (const [key, messages] of Object.entries(value)) {
    if (!Array.isArray(messages)) continue

    const list = messages.filter((item): item is string => typeof item === 'string')
    if (list.length > 0) errors[key] = list
  }

  return Object.keys(errors).length > 0 ? errors : undefined
}

function asApiError(value: unknown): ApiError | null {
  if (!isRecord(value)) return null

  const message = typeof value.message === 'string' ? value.message : undefined
  const errors = asFieldErrors(value.errors)

  if (!message && !errors) return null

  return {
    message: message ?? 'Ошибка валидации',
    ...(errors ? { errors } : {}),
  }
}

/**
 * Достаёт `message` / `errors` из ofetch / h3-ошибки формы.
 * Учитывает обёртку Nitro (`data: { message, errors }`).
 */
export function readFormError(error: unknown): ApiError | null {
  if (!isRecord(error)) return null

  const data = error.data
  const nested = isRecord(data) ? data.data : undefined

  return asApiError(nested) ?? asApiError(data) ?? asApiError(error)
}

/** Первое сообщение по полю или `undefined`. */
export function firstFieldError(error: ApiError | null, field: string): string | undefined {
  return error?.errors?.[field]?.[0]
}
