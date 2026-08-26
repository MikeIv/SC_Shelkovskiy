# SC_Shelkovskiy

Фронтенд **Щёлковский** на **Nuxt 4.5.x** (Vue 3, TypeScript, Nitro): `srcDir: app/`, ESLint + Prettier + Stylelint, Husky, глобальные SCSS-токены, **HTTP API** (`useApi` / `useApiFetch` / `serverApi`). Пакетный менеджер — **pnpm** (см. `packageManager` в `package.json`).

Каркас развёрнут из шаблона Grand `NUXT4_Template`. GitLab: [`grandfs/schelkovsky-frontend`](https://gitlab.com/grandfs/schelkovsky-frontend).

## Старт

1. **`pnpm install`**
2. **`cp .env.example .env`**: задайте **`NUXT_PUBLIC_API_BASE`**, если фронт ходит на отдельный API (иначе оставьте пустым — относительные пути к текущему origin).
3. **`pnpm dev`** — [http://localhost:3000](http://localhost:3000)
4. Правила Cursor — локально в `.cursor/` (каталог в `.gitignore`); см. [`AGENTS.md`](AGENTS.md).

## Требования

- Node.js LTS (рекомендуется актуальная LTS; Nuxt 4.5 — Node `^22.19.0 || ^24.11.0 || >=26.0.0`)
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

| Команда              | Назначение                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`           | dev-сервер (по умолчанию [http://localhost:3000](http://localhost:3000)) |
| `pnpm build`         | production-сборка                                                        |
| `pnpm preview`       | локальный просмотр собранного приложения                                 |
| `pnpm generate`      | статическая генерация (при необходимости)                                |
| `pnpm lint`          | ESLint по проекту                                                        |
| `pnpm lint:fix`      | ESLint с автоисправлением                                                |
| `pnpm format`        | Prettier — запись                                                        |
| `pnpm format:check`  | Prettier — проверка без записи                                           |
| `pnpm stylelint`     | Stylelint для `*.vue` и `*.css`                                          |
| `pnpm stylelint:fix` | Stylelint с автоисправлением                                             |
| `pnpm lint:all`      | последовательно ESLint + Prettier (check) + Stylelint                    |
| `pnpm typecheck`     | `nuxt typecheck`                                                         |
| `pnpm verify`        | `lint:all` + `typecheck`                                                 |

## Качество кода и pre-commit

- **ESLint**: `@nuxt/eslint`, конфиг [`eslint.config.mjs`](eslint.config.mjs).
- **Prettier**: [`prettier.config.mjs`](prettier.config.mjs); файлы `*.vue` в Prettier **не** форматируются (см. [`.prettierignore`](.prettierignore)).
- **Stylelint**: минимальная конфигурация для стилей в SFC — [`stylelint.config.mjs`](stylelint.config.mjs).
- **Husky**: хук [`.husky/pre-commit`](.husky/pre-commit) вызывает [`scripts/pre-commit.mjs`](scripts/pre-commit.mjs) — баннер с именем из `package.json`, lint-staged с флагом `--concurrent false`.
- **lint-staged**: [`lint-staged.config.mjs`](lint-staged.config.mjs). Если в коммите только файлы вне типов для линта, проверки **пропускаются** с пояснением.

Коммит без хуков: `git commit --no-verify` (использовать осознанно).

## Структура проекта (кратко)

Исходники приложения — в **`app/`** ([`nuxt.config.ts`](nuxt.config.ts), `srcDir`): страницы, компоненты, layouts, composables, плагины, middleware, утилиты, ассеты.

Общий код клиента и Nitro — в **`shared/types`** и **`shared/utils`**.

Сервер Nitro — в **`server/`** (`api/`, `routes/`, `middleware/`, `plugins/`, `utils/`).

## HTTP API (каркас)

- База запросов: **`runtimeConfig.public.apiBase`** ← **`NUXT_PUBLIC_API_BASE`** ([`.env.example`](.env.example)).
- Клиент: **`useApi()`** (`$fetch` с `baseURL`) и **`useApiFetch()`** (полный URL = `apiBase` + путь, без `baseURL` в опциях `useFetch`) — [`app/composables/useApi.ts`](app/composables/useApi.ts).
- Сервер: **`serverApi(event?)`** — [`server/utils/serverApi.ts`](server/utils/serverApi.ts); URL — [`shared/utils/normalizeApiBaseUrl.ts`](shared/utils/normalizeApiBaseUrl.ts) (`normalizeApiBaseUrl`, `joinApiUrl`).
- Типизация `public.apiBase` — [`types/nuxt-public.d.ts`](types/nuxt-public.d.ts). Приватные ключи `runtimeConfig` добавляйте в `nuxt.config` и отдельное расширение `RuntimeConfig` в `types/`.

### Правила Cursor (Agent)

Правила агента **не в git** — каталог `.cursor/` в `.gitignore`. Карта: [`AGENTS.md`](AGENTS.md).

| Назначение                     | Файл (локально)                                              |
| ------------------------------ | ------------------------------------------------------------ |
| always: GSD / токены / продукт | `00-workflow-core`, `07-token-economy`, `90-project-context` |
| globs: Nuxt / Vue / SCSS       | `.cursor/rules/nuxt-template.mdc`                            |
| requestable: Discuss…Verify    | `01` … `06`                                                  |
| Slash                          | `/brief` `/wave-done` `/verify` `/code-review`               |
| Планирование (в git)           | [`.planning/PROJECT.md`](.planning/PROJECT.md)               |

Макет Figma (поэтапно): fileKey `ODA7GgG6mA0uKOzMFSiV0T`, node `148:15227`.

Внешний репозиторий workflow: `d:\_WEB\_Work\_Cursor-rules-template\`

### MCP (локально)

`.cursor/mcp.json` (каталог `.cursor/` полностью в `.gitignore`):

```json
{
  "$schema": "https://json.schemastore.org/mcp.json",
  "mcpServers": {
    "nuxt": { "url": "https://mcp.nuxt.com/mcp" },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

## Документация

- Документация продукта — в **`docs/`** (по мере появления).
- [Nuxt 4](https://nuxt.com/docs/4.x/getting-started/introduction)
- [Деплой](https://nuxt.com/docs/getting-started/deployment)
