// https://nuxt.com/docs/api/configuration/nuxt-config
import { API_IMAGE_HOST } from './shared/utils/apiImageHost'
import { isDirectApiBase } from './shared/api/directBase'

const isDev = process.env.NODE_ENV === 'development'

/** Без ключа модуль vue-yandex-maps падает в плагине (`createYmapsOptions`). */
const yandexMapsApikey = process.env.NUXT_PUBLIC_YANDEX_MAPS_APIKEY?.trim() ?? ''

/** Хост стенда: IPX тянет `/storage` только с этого домена и с Basic из рантайм-env. */
const apiImageHost = API_IMAGE_HOST

/**
 * Прямой режим данных: абсолютный `NUXT_PUBLIC_API_BASE` — признак статического хостинга.
 * Серверного ipx там нет (`/_ipx/...` отдал бы index.html), поэтому картинки идут с API как есть.
 */
const directApiBase = isDirectApiBase(process.env.NUXT_PUBLIC_API_BASE)

/**
 * Источника данных нет — сборка уедет на стенд с моками и без единого запроса к Laravel.
 * Ошибка тихая: страницы отрендерятся, а прокси-ручки `/api/*` на статике отдадут index.html
 * с кодом 200. Поэтому конфигурацию проверяем до сборки, а не после деплоя.
 */
if (!directApiBase && !process.env.NUXT_API_UPSTREAM?.trim()) {
  const message = [
    'Источник данных не задан: NUXT_PUBLIC_API_BASE пуст, а NUXT_API_UPSTREAM не определён.',
    'Прямой режим (статический стенд): NUXT_PUBLIC_API_BASE=https://<хост API>/api/v1',
    'Прокси-режим (нужен запущенный сервер Nitro): NUXT_API_UPSTREAM=https://<хост API>/api/v1 и NUXT_API_AUTH=<login:password>',
  ].join(' ')

  /** Локальной сборке моки допустимы, в CI это всегда уехавшая на стенд пустая витрина. */
  if (process.env.CI) throw new Error(message)

  console.warn(`[nuxt.config] ${message}`)
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  /** Исходники приложения в `app/`. Каталог `server/` — в корне репозитория. */
  srcDir: 'app/',

  /** Вложенные composables не сканируются: unimport берёт только `*.ts` в корне каталога. */
  imports: {
    dirs: ['composables/api'],
  },

  css: ['~/assets/css/ui.css', '~/assets/styles/main.scss'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxt/image',
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

  /**
   * Публичные ключи доступны на клиенте; секреты — только в корне `runtimeConfig` без `public`.
   * `apiUpstream` / `apiAuth` перекрываются `NUXT_API_UPSTREAM` и `NUXT_API_AUTH`.
   */
  runtimeConfig: {
    apiUpstream: '',
    apiAuth: '',
    /**
     * `headers` намеренно пустой: Basic для ipx приходит только из рантайма
     * (`NUXT_IPX_HTTP_FETCH_OPTIONS_HEADERS='{"Authorization":"Basic …"}'`), иначе секрет
     * вшивается в серверный бандл и ротация кредов требует пересборки. Вложенное имя
     * (`…_HEADERS_AUTHORIZATION`) не сработает: Nitro применяет env лишь к существующим ключам.
     */
    ipx: {
      http: {
        domains: [apiImageHost],
        fetchOptions: {
          headers: {},
        },
      },
    },
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? '',
    },
  },

  image: {
    provider: directApiBase ? 'none' : 'ipx',
    domains: [apiImageHost],
    format: ['webp'],
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
