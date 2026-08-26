# SC_Shelkovskiy — PROJECT

Постоянный контекст для Cursor Agent.

## Назначение

Фронтенд **Щёлковский** (Grand): Nuxt 4.5, Vue 3, TypeScript, Nitro, ESLint + Prettier + Stylelint, Husky, SCSS-токены (`--fs-*`), HTTP API (`useApi`, `useApiFetch`, `serverApi`).

GitLab: `grandfs/schelkovsky-frontend`.

## Стек

| Слой     | Технология                                 |
| -------- | ------------------------------------------ |
| Frontend | Nuxt 4.5, Vue 3                            |
| Lint     | ESLint (@nuxt/eslint), Prettier, Stylelint |
| Стили    | SCSS, CSS Modules в SFC                    |
| API      | `runtimeConfig.public.apiBase`             |
| PM       | pnpm 11.x                                  |

## Ключевые пути

| Путь                                  | Назначение                |
| ------------------------------------- | ------------------------- |
| `app/pages/`                          | Маршруты                  |
| `app/layouts/default.vue`             | Layout                    |
| `app/composables/useApi.ts`           | HTTP клиент               |
| `server/utils/serverApi.ts`           | API с Nitro               |
| `shared/utils/normalizeApiBaseUrl.ts` | URL API                   |
| `app/assets/styles/`                  | Глобальные стили и токены |

## Команды

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint:all
```

## Cursor rules (локально, `.cursor/` в gitignore)

- Установка: `Cursor-rules-template` / `INSTALL-NUXT-VUE.md`
- Workflow: `00` … `06`; Verify/review/GitLab: `04-verify-and-done.mdc`
- Nuxt: `nuxt-template.mdc`; контекст: `90-project-context.mdc`
- Slash: `/code-review`; справка: `AGENTS.md`

## Ограничения для агента

- API только через обёртки каркаса (`useApi`, `useApiFetch`, `serverApi`)
- Не коммитить `.env`
- Минимальный diff, без лишнего рефакторинга
