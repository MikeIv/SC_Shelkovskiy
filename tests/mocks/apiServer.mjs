/**
 * Мок Laravel-API для e2e-тестов: отдаёт фикстуры из `tests/fixtures/api`.
 *
 * Запуск: `node tests/mocks/apiServer.mjs`
 * Переменные: `MOCK_API_PORT` (по умолчанию 4788), `MOCK_API_SCENARIO` = `default` | `empty` | `error` | `invalid`.
 *
 * Стенд в тестах не используется: e2e не должен зависеть от наполнения админки.
 */
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'

const PORT = Number(process.env.MOCK_API_PORT ?? 4788)
const SCENARIO = process.env.MOCK_API_SCENARIO ?? 'default'

function fixture(name) {
  return JSON.parse(readFileSync(new URL(`../fixtures/api/${name}`, import.meta.url), 'utf8'))
}

function json(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  })
  res.end(body)
}

/** Битый payload: прокси обязан ответить 502, а не отдать мусор на клиент. */
const INVALID_HOME = { data: { slides: 'oops' } }

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`)
  const { pathname } = url

  if (pathname === '/__health') {
    return json(res, 200, { ok: true, scenario: SCENARIO })
  }

  if (pathname === '/api/v1/layout') {
    return json(res, 200, fixture('layout.json'))
  }

  if (pathname === '/api/v1/home') {
    if (SCENARIO === 'error') return json(res, 500, { message: 'Mock upstream failure' })
    if (SCENARIO === 'invalid') return json(res, 200, INVALID_HOME)
    if (SCENARIO === 'empty') return json(res, 200, fixture('home.empty.json'))
    return json(res, 200, fixture('home.json'))
  }

  if (pathname === '/api/v1/forms/feedback' && req.method === 'POST') {
    return json(res, 201, { data: { ok: true } })
  }

  if (pathname === '/api/v1/tenants') {
    const type = url.searchParams.get('type')
    if (type === 'shops') return json(res, 200, fixture('tenants.shops.json'))
    return json(res, 200, { data: [], meta: { filters: { categories: [], floors: [] } } })
  }

  if (pathname === '/api/v1/tenants/test-shop') {
    return json(res, 200, fixture('tenant.json'))
  }

  if (pathname === '/api/v1/feed') {
    return json(res, 200, fixture('tenant.feed.json'))
  }

  return json(res, 404, { message: 'Not found' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[mock-api] http://127.0.0.1:${PORT} (scenario: ${SCENARIO})`)
})
