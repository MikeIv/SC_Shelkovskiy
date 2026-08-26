# Agent workflow — SC_Shelkovskiy

Правила Cursor **локальные** — каталог `.cursor/` в `.gitignore`, в git продукта не хранятся.

После клонирования установите правила из **`Cursor-rules-template`** (`INSTALL-NUXT-VUE.md`). Контекст продукта: `90-project-context`, `.planning/PROJECT.md`.

## Правила (`.cursor/rules/` — локально)

| Файл                        | Назначение                                                          |
| --------------------------- | ------------------------------------------------------------------- |
| `00-workflow-core`          | S/M/L/XL, фазы GSD + Superpowers, Verify/code-review                |
| `01-discuss-before-code`    | Уточнение до кода                                                   |
| `02-planning-gsd`           | `.planning/`, волны                                                 |
| `03-execution-discipline`   | Минимальный diff, `useApi`                                          |
| `04-verify-and-done`        | Lint, security Nuxt, code-review (local / GitLab MR)                |
| `05-context-hygiene`        | Узкий контекст                                                      |
| `06-fundamental-principles` | Мета-принципы: причина vs симптом, типы, эталоны, минимализм правил |
| `90-project-context`        | Контекст продукта, GitLab                                           |
| `nuxt-template`             | Nuxt 4.5, Vue, SCSS, линты                                          |

## Slash-команды (`.cursor/commands/` — локально)

| Команда        | Назначение                               |
| -------------- | ---------------------------------------- |
| `/code-review` | Review локальных изменений или GitLab MR |

## После клонирования

1. `pnpm install` и `cp .env.example .env`
2. Правила Cursor из `Cursor-rules-template` (`INSTALL-NUXT-VUE.md`), если `.cursor/` ещё нет
3. Контекст: `.cursor/rules/90-project-context.mdc`, `.planning/PROJECT.md`

## Задача агенту

```text
Класс M. Задача: …
Done when: …
```

```bash
cp .planning/brief-template.md .planning/brief.md
```

## Внешний шаблон правил

Расширенная инструкция и синхронизация: `d:\_WEB\_Work\_Cursor-rules-template\INSTALL-NUXT-VUE.md`
