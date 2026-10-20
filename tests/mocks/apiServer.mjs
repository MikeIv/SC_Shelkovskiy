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

/** Фикстуры читаются один раз за процесс: пул ленты запрашивается на каждую страницу. */
const FIXTURES = new Map()

function fixture(name) {
  const cached = FIXTURES.get(name)
  if (cached) return cached

  const payload = JSON.parse(
    readFileSync(new URL(`../fixtures/api/${name}`, import.meta.url), 'utf8'),
  )
  FIXTURES.set(name, payload)

  return payload
}

/**
 * CORS как у боевого Laravel после настройки `config/cors.php`: в прямом режиме
 * (статический стенд) браузер ходит в API напрямую, без прокси Nitro.
 */
const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type,accept,x-mock-fresh',
}

function json(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    ...CORS_HEADERS,
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  })
  res.end(body)
}

/** Битый payload: прокси обязан ответить 502, а не отдать мусор на клиент. */
const INVALID_HOME = { data: { slides: 'oops' } }

/** Детальные ленты: неизвестный slug отдаёт 404, как стенд. */
const FEED_DETAILS = {
  'test-news-one': 'feed.detail.news.json',
  'test-action-one': 'feed.detail.action.json',
}

/** Детальные афиши: каждый slug списка открывается, как на стенде. */
const EVENT_DETAILS = {
  'test-event-one': 'event.json',
  'test-event-two': 'event.two.json',
}

/** Пул записей вкладки: фикстуры — это записи, а не страницы, страницы считает мок. */
function feedPool(type) {
  if (type === 'action') return fixture('feed.action.json').data
  if (type === 'smi') return fixture('feed.smi.json').data

  /** Без `type` живой `/feed` отдаёт новости и акции, СМИ — только с `type=smi`. */
  if (!type) return [...fixture('feed.news.json').data, ...fixture('feed.action.json').data]

  return fixture('feed.news.json').data
}

/** Страница ленты по `page`/`per_page` с `meta` Laravel и вычетом `exclude`. */
function feedListFixture(url) {
  const type = url.searchParams.get('type')
  const page = Number(url.searchParams.get('page') ?? '1')
  const perPage = Number(url.searchParams.get('per_page') ?? '12')
  const exclude = url.searchParams.get('exclude')

  const pool = feedPool(type).filter((item) => item.slug !== exclude)
  const start = (page - 1) * perPage

  return {
    data: pool.slice(start, start + perPage),
    meta: {
      current_page: page,
      last_page: Math.max(1, Math.ceil(pool.length / perPage)),
      per_page: perPage,
      total: pool.length,
    },
  }
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`)
  const { pathname } = url

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS)

    return res.end()
  }

  if (pathname === '/__health') {
    return json(res, 200, { ok: true, scenario: SCENARIO })
  }

  if (pathname === '/api/v1/layout') {
    return json(res, 200, fixture('layout.json'))
  }

  if (pathname === '/api/v1/pages/contacts') {
    return json(res, 200, fixture('pages.contacts.json'))
  }

  if (pathname === '/api/v1/home') {
    if (SCENARIO === 'error') return json(res, 500, { message: 'Mock upstream failure' })
    if (SCENARIO === 'invalid') return json(res, 200, INVALID_HOME)
    if (SCENARIO === 'empty') return json(res, 200, fixture('home.empty.json'))
    /** Проверка ревалидации: с этим заголовком отдаём «свежую» главную — данные из админки. */
    if (req.headers['x-mock-fresh']) return json(res, 200, fixture('home.fresh.json'))
    return json(res, 200, fixture('home.json'))
  }

  if (pathname === '/api/v1/forms/feedback' && req.method === 'POST') {
    return json(res, 201, { data: { id: 154 } })
  }

  if (pathname === '/api/v1/tenants') {
    const type = url.searchParams.get('type')
    if (type === 'shops') return json(res, 200, fixture('tenants.shops.json'))
    return json(res, 200, { data: [], meta: { filters: { categories: [], floors: [] } } })
  }

  if (pathname === '/api/v1/tenants/test-shop') {
    return json(res, 200, fixture('tenant.json'))
  }

  if (pathname === '/api/v1/vacancies') {
    return json(res, 200, fixture('vacancies.json'))
  }

  if (pathname === '/api/v1/feed') {
    if (url.searchParams.get('tenant')) return json(res, 200, fixture('tenant.feed.json'))
    return json(res, 200, feedListFixture(url))
  }

  if (pathname.startsWith('/api/v1/feed/')) {
    const slug = decodeURIComponent(pathname.slice('/api/v1/feed/'.length))
    const detail = FEED_DETAILS[slug]
    if (!detail) return json(res, 404, { message: 'Not found' })
    return json(res, 200, fixture(detail))
  }

  if (pathname === '/api/v1/events') {
    return json(res, 200, fixture('events.json'))
  }

  if (pathname.startsWith('/api/v1/events/')) {
    const slug = decodeURIComponent(pathname.slice('/api/v1/events/'.length))
    const detail = EVENT_DETAILS[slug]
    if (!detail) return json(res, 404, { message: 'Not found' })
    return json(res, 200, fixture(detail))
  }

  return json(res, 404, { message: 'Not found' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[mock-api] http://127.0.0.1:${PORT} (scenario: ${SCENARIO})`)
})
