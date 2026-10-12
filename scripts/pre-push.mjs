/**
 * Обёртка Husky: тесты перед пушем.
 *
 * Стадия `test` в CI была единственным местом, где тесты вообще запускались: pre-commit
 * и `pnpm verify` проверяют только линт и типы, поэтому красный прогон всплывал уже после
 * отправки ветки. Здесь тот же набор, что и в CI (`pnpm test`), но до пуша — e2e остаётся
 * за пайплайном: ему нужны браузеры и три сервера.
 *
 * `pnpm` запускается через `shell` — на Windows это `.cmd`, без shell дочерний процесс не стартует.
 */
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)

const env = { ...process.env }
delete env.NO_COLOR

console.log('\n  pre-push  ·  pnpm test (unit + component)\n')

const result = spawnSync('pnpm', ['test'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: { ...env, FORCE_COLOR: '1' },
})

const status = result.status ?? (result.signal ? 1 : 0)

console.log(
  status === 0
    ? '\n  ✓  Тесты пройдены. Можно пушить.\n'
    : '\n  ✗  Тесты не прошли — пуш остановлен. Обход (осторожно): git push --no-verify\n',
)

process.exit(status)
