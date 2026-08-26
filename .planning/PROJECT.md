# SC_Shelkovskiy — PROJECT

Постоянный контекст для Cursor Agent.

## Назначение

Фронтенд **Щёлковский** (Grand): Nuxt 4.5, Vue 3, TypeScript, Nitro, SCSS-токены (`--fs-*`), HTTP API, поэтапная вёрстка макета Figma.

GitLab: `grandfs/schelkovsky-frontend`.

## Стек

| Слой     | Технология                                        |
| -------- | ------------------------------------------------- |
| Frontend | Nuxt 4.5, Vue 3, SSR включён                      |
| Lint     | ESLint (@nuxt/eslint), Prettier, Stylelint, Husky |
| Стили    | SCSS, CSS Modules, mobile-first (`from-*`)        |
| API      | `runtimeConfig.public.apiBase`                    |
| Макет    | Figma `ODA7GgG6mA0uKOzMFSiV0T` (в развитии)       |
| PM       | pnpm 11.x                                         |

## Макет Figma

Реализация **по шагам**, не весь файл. Стартовый node: `148:15227`.

[Щёлковский сайт — в разработку](https://www.figma.com/design/ODA7GgG6mA0uKOzMFSiV0T/%D0%A9%D1%91%D0%BB%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9-%D1%81%D0%B0%D0%B9%D1%82---%D0%B2-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D1%83?node-id=148-15227)

MCP: `.cursor/mcp.json` → server `figma`. Нет доступа — шаринг view на аккаунт MCP.

## Эталоны

| Путь                                  | Назначение      |
| ------------------------------------- | --------------- |
| `app/pages/`                          | Маршруты        |
| `app/layouts/default.vue`             | Layout          |
| `app/composables/useApi.ts`           | HTTP клиент     |
| `server/utils/serverApi.ts`           | API с Nitro     |
| `shared/utils/normalizeApiBaseUrl.ts` | URL API         |
| `app/assets/styles/`                  | Токены и mixins |

## Команды

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm verify
pnpm build
pnpm lint:all
```

## Cursor

- always: `00`, `07`, `90` · globs: `nuxt-template` · requestable: `01`–`06`
- Slash: `/brief` `/wave-done` `/verify` `/code-review`
- Справка: `AGENTS.md`

## Ограничения

- API только через `useApi` / `useApiFetch` / `serverApi`
- Стили: `--fs-*`, mobile-first, без desktop-first `max-width`
- Макет — один кадр за волну
- Не коммитить `.env`; минимальный diff
