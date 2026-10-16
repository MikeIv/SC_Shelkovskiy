#!/usr/bin/env node
/**
 * Обёртка Husky/CI: проверка рассинхрона `.cursor/rules` ↔ `AGENTS.md` / `.dsh/skills`.
 *
 * `.cursor/` в `.gitignore` — в CI каталога нет, и прямой вызов `node .cursor/check-rules.mjs`
 * упал бы там с MODULE_NOT_FOUND, завалив стадию `verify`. Здесь отсутствие каталога —
 * штатный пропуск: правила живут локально, проверять в CI нечего.
 *
 * Запуск: node scripts/check-rules.mjs (то же делает `pnpm rules:check`)
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const local = join(root, '.cursor', 'check-rules.mjs')

if (!existsSync(local)) {
  console.log('rules:check: .cursor нет (локальные правила) — проверка пропущена')
  process.exit(0)
}

const env = { ...process.env }
delete env.NO_COLOR

const result = spawnSync(process.execPath, [local], {
  cwd: root,
  stdio: 'inherit',
  env: { ...env, FORCE_COLOR: '1' },
})

process.exit(result.status ?? (result.signal ? 1 : 0))
