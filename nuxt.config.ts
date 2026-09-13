// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV === 'development'

/** Без ключа модуль vue-yandex-maps падает в плагине (`createYmapsOptions`). */
const yandexMapsApikey = process.env.NUXT_PUBLIC_YANDEX_MAPS_APIKEY?.trim() ?? ''

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  /** Исходники приложения в `app/`. Каталог `server/` — в корне репозитория. */
  srcDir: 'app/',

  css: ['~/assets/css/ui.css', '~/assets/styles/main.scss'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    ...(yandexMapsApikey ? (['vue-yandex-maps/nuxt'] as const) : []),
  ],

  ...(yandexMapsApikey
    ? {
        yandexMaps: {
          apikey: yandexMapsApikey,
          lang: 'ru_RU' as const,
        },
      }
    : {}),

  ui: {
    fonts: false,
    colorMode: false,
  },

  icon: {
    customCollections: [
      {
        prefix: 'local',
        dir: './app/assets/icons',
      },
    ],
    clientBundle: {
      scan: true,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap',
        },
      ],
    },
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  devtools: {
    /** В production-сборке DevTools не подключаем — меньше шум и размер. */
    enabled: isDev,
    timeline: { enabled: isDev },
  },

  typescript: {
    strict: true,
    /** Проверка типов на `nuxt build` / `nuxt generate`, без замедления каждого сохранения в dev */
    typeCheck: 'build',
  },

  /** Публичные ключи доступны на клиенте; секреты — только в корне `runtimeConfig` без `public` */
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? '',
    },
  },

  features: {
    /** Логи Nuxt devtools в production не нужны */
    devLogs: isDev,
  },

  /** Workaround Vite 8: `#app-manifest` (nuxt#33606). Route rules на клиенте не нужны. */
  experimental: {
    appManifest: false,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['app/assets/styles'],
        },
      },
    },
    optimizeDeps: {
      exclude: ['#app-manifest'],
    },
    build: {
      target: 'esnext',
      cssMinify: true,
    },
  },

  nitro: {
    compressPublicAssets: true,
  },
})
