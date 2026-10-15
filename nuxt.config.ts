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
 * Команды, которые кладут данные в статику. Проверяем именно их, потому что этот же
 * конфиг читают `nuxt prepare` (он идёт из `postinstall` при `pnpm install`) и `nuxt dev`:
 * на подготовке окружения источника данных ещё нет по определению, и падать там нельзя.
 */
const BUILD_COMMAND = ['build', 'generate']
const isBuildCommand = BUILD_COMMAND.some((command) => process.argv.includes(command))

/**
 * Источника данных нет — сборка уедет на стенд с моками и без единого запроса к Laravel.
 * Ошибка тихая: страницы отрендерятся, а прокси-ручки `/api/*` на статике отдадут index.html
 * с кодом 200. Поэтому конфигурацию проверяем до сборки, а не после деплоя.
 *
 * Требование включает `NUXT_REQUIRE_API_SOURCE` (его ставит job сборки), а не `CI`:
 * `postinstall` тоже читает этот конфиг, и проверка, завязанная на `CI`, роняет установку
 * зависимостей, а не сборку.
 */
if (!directApiBase && !process.env.NUXT_API_UPSTREAM?.trim() && isBuildCommand) {
  const message = [
    'Источник данных не задан: NUXT_PUBLIC_API_BASE пуст, а NUXT_API_UPSTREAM не определён.',
    'Прямой режим (статический стенд): NUXT_PUBLIC_API_BASE=https://<хост API>/api/v1',
    'Прокси-режим (нужен запущенный сервер Nitro): NUXT_API_UPSTREAM=https://<хост API>/api/v1 и NUXT_API_AUTH=<login:password>',
  ].join(' ')

  /** Локально моки допустимы (предупреждение), на стенде это всегда пустая витрина. */
  if (process.env.NUXT_REQUIRE_API_SOURCE) throw new Error(message)

  console.warn(`[nuxt.config] ${message}`)
}

/**
 * База API «на вид правильная»: абсолютный URL с версией пути. Без неё адрес вида
 * `https://host/api` отвечает 404, и данные снова подменяются моками молча.
 */
const API_PATH_PATTERN = /^https?:\/\/[^/]+\/api\/v\d+\/?$/i

/**
 * Проверка базы запросом: делает сборку громкой при опечатке в хосте или пути.
 * Корень базы (`/api/v1`) сам отдаёт 404, поэтому проверяем боевую ручку `/home`:
 * битая база не пройдёт, а рабочий хост со сменившимся `/home` — пройдёт.
 * Только там, где источник данных обязателен: сеть не должна ронять локальную сборку.
 */
async function assertApiBaseReachable(): Promise<void> {
  const base = process.env.NUXT_PUBLIC_API_BASE?.trim()
  if (!base) return

  if (!API_PATH_PATTERN.test(base)) {
    throw new Error(
      `NUXT_PUBLIC_API_BASE не похож на базу API: «${base}». Ожидается https://<хост>/api/v1`,
    )
  }

  const probe = `${base.replace(/\/+$/, '')}/home`

  let status: number

  try {
    status = (await fetch(probe, { headers: { Accept: 'application/json' } })).status
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)

    throw new Error(`NUXT_PUBLIC_API_BASE недоступен: «${probe}» (${reason})`, { cause: error })
  }

  if (status === 404) {
    throw new Error(`NUXT_PUBLIC_API_BASE отвечает 404: «${probe}». Проверьте хост и версию пути`)
  }
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
      /** Соцсети layout API (`item.icon`) — scan не видит динамический `:name`. */
      icons: [
        'local:social-dzen',
        'local:social-globe',
        'local:social-max',
        'local:social-rutube',
        'local:social-telegram',
        'local:social-vk',
      ],
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
    prerender: {
      /**
       * Nuxt включает `failOnError: true` (в Nitro по умолчанию `false`), и тогда одна
       * неудачная страница рвёт всю генерацию: 546 маршрутов против лимита API 120 запросов
       * в минуту. Падать должен деплой при отсутствии источника данных, а не отдельная
       * страница — её состояние видно в отчёте пререндера.
       */
      failOnError: false,
    },
  },

  hooks: {
    /**
     * Проверяем адрес API запросом до рендера: сборка должна падать на опечатке в базе,
     * а не выпускать витрину с моками. Только там, где источник обязателен.
     */
    async 'build:before'() {
      if (!process.env.NUXT_REQUIRE_API_SOURCE || !directApiBase) return

      await assertApiBaseReachable()
    },
  },
})
