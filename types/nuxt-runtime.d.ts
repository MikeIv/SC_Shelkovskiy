declare module 'nuxt/schema' {
  interface RuntimeConfig {
    /** База upstream API без завершающего `/`. Пустая строка — прокси отвечает 503, клиент берёт мок. */
    apiUpstream: string
    /** `login:password` для Basic auth стенда. На клиент не попадает. */
    apiAuth: string
    ipx: {
      http: {
        domains: string[]
        fetchOptions: {
          headers: Record<string, string>
        }
      }
    }
  }
}

export {}
