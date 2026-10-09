/** Basic-заголовок для стенда. Пустые креды — заголовок не ставим. */
export function basicAuthorization(apiAuth: string | null | undefined): string | undefined {
  const credentials = apiAuth?.trim() ?? ''
  if (!credentials) return undefined
  return `Basic ${Buffer.from(credentials).toString('base64')}`
}
