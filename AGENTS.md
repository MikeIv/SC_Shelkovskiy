# Agent workflow — SC_Shelkovskiy

Правила: `.cursor/rules/` (локально, в gitignore) · Продукт: `90-project-context.mdc`, `.planning/PROJECT.md`.

## Карта правил

| Правило         | Режим                                  | Назначение                                          |
| --------------- | -------------------------------------- | --------------------------------------------------- |
| `00`            | **always**                             | GSD: классы, фазы, стоп, краткий Verify             |
| `07`            | **always**                             | Экономия токенов (чат + контекст)                   |
| `90`            | **always**                             | Фаза, команды, эталоны, Figma, MCP                  |
| `nuxt-template` | **globs** `app/`, `server/`, `shared/` | TS, Vue, SCSS, mobile-first, линты                  |
| `01`–`06`       | **requestable**                        | Discuss, Plan, Execute, Verify, Context, Principles |

## Команды

| Команда        | Назначение                      |
| -------------- | ------------------------------- |
| `/brief`       | `.planning/brief.md` из шаблона |
| `/wave-done`   | Итог волны в `state.md`         |
| `/verify`      | Проверки по классу задачи       |
| `/code-review` | Local diff или GitLab MR        |

MCP: `.cursor/mcp.json` (nuxt, context7, figma).

## Промпт агенту

```text
Класс M. Задача: … Done when: …
```

Новая сессия L+: `@.planning/PROJECT.md` `@.planning/brief.md`

Макет: поэтапно, кадр из `90` (fileKey `ODA7GgG6mA0uKOzMFSiV0T`).

Синхронизация workflow: `_Cursor-rules-template`; `90-project-context` — только дополнять.
