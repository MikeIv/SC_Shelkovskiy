# SC_Shelkovskiy

Фронтенд **Щёлковский** на **Nuxt 4.6.x** (Vue 3, TypeScript, Nitro): `srcDir: app/`, ESLint + Prettier + Stylelint, Husky, глобальные SCSS-токены, **HTTP API** (`useApi` / `useApiFetch` / `serverApi`). Пакетный менеджер — **pnpm** (см. `packageManager` в `package.json`).

Каркас развёрнут из шаблона Grand `NUXT4_Template`. GitLab: [`grandfs/schelkovsky-frontend`](https://gitlab.com/grandfs/schelkovsky-frontend).

## Старт

1. **`pnpm install`**
2. **`cp .env.example .env`**: задайте **`NUXT_PUBLIC_API_BASE`**, если фронт ходит на отдельный API (иначе оставьте пустым — относительные пути к текущему origin). Режимы — в разделе [HTTP API](#http-api).
3. **`pnpm dev`** — [http://localhost:3000](http://localhost:3000)

## Требования

- Node.js LTS (рекомендуется актуальная LTS; Nuxt 4.6 — Node `^22.22.3 || ^24.15.0 || >=26.0.0`)
- [pnpm](https://pnpm.io/) 11.x (в репозитории зафиксирована версия через поле `packageManager` и Corepack)

## Установка

```bash
pnpm install
```

После установки автоматически выполняются:

- `postinstall` → `nuxt prepare` (генерация `.nuxt`, в т.ч. база для ESLint)
- `prepare` → `husky` (Git-хуки)

Если хуки не подхватились: `pnpm exec husky` (в `git config --get core.hooksPath` должно быть `.husky/_`).

При предупреждении pnpm про postinstall-скрипты:

```bash
pnpm approve-builds --all
```

Сборки нативных зависимостей разрешены в [`pnpm-workspace.yaml`](pnpm-workspace.yaml) (`allowBuilds` + `onlyBuiltDependencies`).

## Скрипты

| Команда               | Назначение                                                               |
| --------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`            | dev-сервер (по умолчанию [http://localhost:3000](http://localhost:3000)) |
| `pnpm build`          | production-сборка                                                        |
| `pnpm preview`        | локальный просмотр собранного приложения                                 |
| `pnpm generate`       | статическая генерация (при необходимости)                                |
| `pnpm lint`           | ESLint по проекту                                                        |
| `pnpm lint:fix`       | ESLint с автоисправлением                                                |
| `pnpm format`         | Prettier — запись                                                        |
| `pnpm format:check`   | Prettier — проверка без записи                                           |
| `pnpm stylelint`      | Stylelint для `*.vue` и `*.css`                                          |
| `pnpm stylelint:fix`  | Stylelint с автоисправлением                                             |
| `pnpm lint:all`       | последовательно ESLint + Prettier (check) + Stylelint                    |
| `pnpm typecheck`      | `nuxt typecheck`                                                         |
| `pnpm test`           | Vitest: `test:unit` + `test:component` — то же, что стадия `test` в CI   |
| `pnpm test:unit`      | Vitest, проект `node`: `tests/unit`, `tests/server`                      |
| `pnpm test:component` | Vitest, проект `nuxt`: `tests/nuxt` (окружение Nuxt)                     |
| `pnpm test:e2e`       | Playwright на мок-API (`tests/e2e`, два прогона: прокси- и прямой режим) |
| `pnpm verify`         | `lint:all` + `rules:check` + `typecheck`                                 |
| `pnpm rules:check`    | рассинхрон правил: `.cursor/rules` ↔ `AGENTS.md` / `.dsh/skills`         |
| `pnpm figma:meta`     | Figma REST: `fileKey`, страницы, дата правки                             |
| `pnpm figma:nodes`    | узел макета: дерево, тексты, шрифты; `--json` — дамп                     |
| `pnpm figma:png`      | рендер узла в PNG `@2x` → `.planning/figma/`                             |

## Качество кода и git-хуки

- **ESLint**: `@nuxt/eslint`, конфиг [`eslint.config.mjs`](eslint.config.mjs).
- **Prettier**: [`prettier.config.mjs`](prettier.config.mjs); файлы `*.vue` в Prettier **не** форматируются (см. [`.prettierignore`](.prettierignore)).
- **Stylelint**: минимальная конфигурация для стилей в SFC — [`stylelint.config.mjs`](stylelint.config.mjs).
- **Husky, pre-commit**: хук [`.husky/pre-commit`](.husky/pre-commit) вызывает [`scripts/pre-commit.mjs`](scripts/pre-commit.mjs) — баннер с именем из `package.json`, проверка рассинхрона правил, lint-staged с флагом `--concurrent false`.
- **Husky, pre-push**: хук [`.husky/pre-push`](.husky/pre-push) вызывает [`scripts/pre-push.mjs`](scripts/pre-push.mjs) — `pnpm test` (unit + component). E2E остаётся за CI: ему нужны браузеры и запуск dev-серверов.
- **E2E и `pnpm dev`**: Nuxt CLI держит блокировку на `.nuxt`, пока работает dev-сервер, поэтому `pnpm test:e2e` запускается при остановленном `pnpm dev` (иначе Playwright не поднимет свой сервер). Два режима данных проверяются двумя прогонами подряд — [`playwright.config.ts`](playwright.config.ts) и [`playwright.direct.config.ts`](playwright.direct.config.ts).
- **lint-staged**: [`lint-staged.config.mjs`](lint-staged.config.mjs). Если в коммите только файлы вне типов для линта, проверки **пропускаются** с пояснением.

## Зависимости

- **`h3` (dev)**: код её не импортирует, зависимость закреплена ради раскладки. Стенд собирается npm без lockfile и поднимает в корень `node_modules` вторую копию `h3` — v2, её тянет dev-тулинг Nuxt. Тогда бренд события у `defineEventHandler`/`readBody` и у `ApiEvent` (выведен из `useRuntimeConfig`) расходятся, и `nuxt build` падает на `TS2769`. Пин держит корневую копию на линии 1.x, которой живут Nitro и nitropack; v2 остаётся вложенной у своего потребителя.

Коммит без хуков: `git commit --no-verify`, пуш без тестов: `git push --no-verify` (использовать осознанно).

## Структура проекта (кратко)

Исходники приложения — в **`app/`** ([`nuxt.config.ts`](nuxt.config.ts), `srcDir`): страницы, компоненты, layouts, composables, плагины, middleware, утилиты, ассеты.

Общий код клиента и Nitro — в **`shared/types`** и **`shared/utils`**.

Сервер Nitro — в **`server/`** (`api/`, `routes/`, `middleware/`, `plugins/`, `utils/`).

## HTTP API

Режим данных задаёт **`runtimeConfig.public.apiBase`** ← **`NUXT_PUBLIC_API_BASE`** ([`.env.example`](.env.example)):

| `NUXT_PUBLIC_API_BASE`  | Режим  | Кто ходит в Laravel          | Basic                         | CORS         |
| ----------------------- | ------ | ---------------------------- | ----------------------------- | ------------ |
| пусто или относительный | прокси | ручки Nitro `/api/*`         | да, только на сервере         | не нужен     |
| абсолютный URL API      | прямой | браузер и пререндер напрямую | нет — секрет попал бы в бандл | нужен на API |

Прямой режим — для статического хостинга стенда (devdeployer отдаёт только `.output/public`,
серверных ручек там нет); ipx в нём отключается, картинки идут с API как есть.
Правила API ([общие правила](https://schelkovsky-backend-main.grandfs-develop.ru/docs)):
база `{BACKEND}/api/v1`, авторизации нет, `Accept: application/json`, вход по CORS —
`CORS разрешён только доменам из FRONTEND_URLS на бэкенде`. Значит origin стенда должен быть
в `FRONTEND_URLS`, иначе браузер отклонит ответ.

Отсутствие источника данных на сборке — ошибка, а не моковая витрина наружу: `NUXT_REQUIRE_API_SOURCE=1`
(его ставит job `build` в [`.gitlab-ci.yml`](.gitlab-ci.yml)) роняет `nuxt build`, если нет ни
абсолютного `NUXT_PUBLIC_API_BASE`, ни `NUXT_API_UPSTREAM`. На `nuxt prepare` (идёт из `postinstall`
при `pnpm install`) и на `nuxt dev` проверка не срабатывает — там источника данных ещё нет.
В том же режиме база проверяется запросом к `/home`: опечатка в хосте или пути (`/api` вместо
`/api/v1`) роняет сборку вместо тихой подмены контентом из `~/data`.

Когда API не отдал раздел и страница показала демо-контент, появляется ярлык
«Демо-данные» — [`DemoDataBadge.vue`](app/components/ui/DemoDataBadge.vue).
На главной — в секциях с моком (`useHome.demo`); на остальных страницах — плашка в углу
[`DemoDataNotice.vue`](app/components/ui/DemoDataNotice.vue) / [`useDemoData`](app/composables/useDemoData.ts)
(признак только на клиенте, в статику не попадает).
404 от API остаётся 404 (страницы нет), а сбой API (5xx, таймаут, CORS) — это не «не найдено»:
детальные composables подставляют демо-запись, если она есть, иначе показывают настоящий код ошибки.

- Контракт ручек общий для обоих режимов — [`shared/api/endpoints.ts`](shared/api/endpoints.ts): путь у Laravel, проверка `query`/`slug`, проверка формы ответа, маппинг DTO → UI. Транспорты: [`server/api/*`](server/api) (Nitro) и [`shared/api/direct.ts`](shared/api/direct.ts) (клиент).
- Лимит API (429 + `Retry-After`, у стенда 120 запросов в минуту на IP) — [`shared/api/throttle.ts`](shared/api/throttle.ts): серверные запросы ждут окно лимита, иначе пререндер сотен страниц падает.
- Клиент: **`useApi()`** (`$fetch` с `baseURL`) и **`useApiFetch()`** — [`app/composables/useApi.ts`](app/composables/useApi.ts); тип ответа для обоих режимов — `ApiEnvelope<UI-тип>`.
- Сервер: **`serverApi(event?)`** — [`server/utils/serverApi.ts`](server/utils/serverApi.ts) (сейчас нигде не используется: ручки берут `apiFetch`); **`apiFetch(event?)`** — [`server/utils/apiFetch.ts`](server/utils/apiFetch.ts). URL — [`shared/utils/normalizeApiBaseUrl.ts`](shared/utils/normalizeApiBaseUrl.ts) (`normalizeApiBaseUrl`, `joinApiUrl`).
- Типизация `public.apiBase` — [`types/nuxt-public.d.ts`](types/nuxt-public.d.ts). Приватные ключи `runtimeConfig` добавляйте в `nuxt.config` и отдельное расширение `RuntimeConfig` в `types/`.

### Кино на главной — Афиша

Раздел «Кино» берёт расписание кинотеатра ТРЦ из Афиши API v3 (`https://api.afisha.ru/v3`), а покупку отдаёт её виджету:

- Ручка — [`server/api/cinema.get.ts`](server/api/cinema.get.ts), клиент API — [`server/utils/afishaApi.ts`](server/utils/afishaApi.ts), маппер — [`shared/utils/mappers/afisha.ts`](shared/utils/mappers/afisha.ts), composable — [`useCinema`](app/composables/api/useCinema.ts).
- API вызывается **только с сервера**: партнёрский ключ (`X-ApiAuth-PartnerKey`) секретный, а `api.afisha.ru` закрыт белым списком IP. Ошибка (ключа нет, IP не в списке, вендор недоступен) — это моки `~/data/homeCinemaItems` и ярлык «Демо-данные», как у остальных секций главной.
- **Статический стенд** (прямой режим): серверной ручки там нет, поэтому вместо заглушек раздел показывает встроенное расписание кинотеатра из виджета Афиши — [`CinemaWidget`](app/components/home/CinemaWidget.vue) и экран `place` ([`useAfishaWidget`](app/composables/useAfishaWidget.ts)). Виджет клиентский: партнёрский ключ и белый список IP ему не нужны, достаточно `NUXT_PUBLIC_AFISHA_WIDGET_PLACE_ID`. Если SDK не поднялся — снова карточки-заглушки.
- Виджет покупки — [`useAfishaWidget`](app/composables/useAfishaWidget.ts): SDK `afisha.ru/w/afishaWidgetManager.global.js` грузится по клику на «Купить билет»; если он не поднялся, карточка открывает страницу фильма на Афише.
- Переменные — `NUXT_AFISHA_PARTNER_KEY`, `NUXT_AFISHA_CITY_ID`, `NUXT_AFISHA_PLACE_ID`, `NUXT_AFISHA_PLACE_NAME`, `NUXT_PUBLIC_AFISHA_WIDGET_KEY`, `NUXT_PUBLIC_AFISHA_WIDGET_PLACE_ID` ([`.env.example`](.env.example)). Без `CITY_ID`/`PLACE_ID` ручка ищет Москву и площадку по вхождению в название.

## Макет Figma

- Ключ файла и узлы — в локальных правилах `.cursor/rules/90-project-context.mdc` (каталог вне git): хелпер берёт `fileKey` оттуда, переопределение — `--key` или `FIGMA_FILE_KEY`. У файла есть живые копии-двойники с тем же именем, поэтому перед вёрсткой — `pnpm figma:meta`.
- Токен: переменная окружения `FIGMA_TOKEN` (в шелле; `.env` скрипт **не** читает) либо локальный файл `~/.dsh/figma-pat.txt`.
- Хелпер — [`scripts/figma.mjs`](scripts/figma.mjs): `figma:meta` — страницы и дата правки, `figma:nodes` — дерево, тексты, шрифты, `figma:png` — рендер `@2x`.
- Дампы и рендеры складываются в `.planning/figma/` (в `.gitignore`); вёрстка — один кадр за волну.

## Документация

- Документация продукта — в **`docs/`** (по мере появления).
- Макет: [Щёлковский сайт — в разработку (Copy)](https://www.figma.com/design/KeUxbFvpJkqDdRgAdztQXe/%D0%A9%D1%91%D0%BB%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9-%D1%81%D0%B0%D0%B9%D1%82---%D0%B2-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83--Copy-?node-id=148-15227) (проверено 16.10.2026; у файла есть копия-двойник `MUScp7tVggGUWenPq4EXFf` — не использовать)
- [Nuxt 4](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Деплой](https://nuxt.com/docs/getting-started/deployment)
