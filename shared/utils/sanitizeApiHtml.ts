/** Теги, которые остаются в тексте из CMS. Всё остальное разворачивается (тег снимается, текст остаётся). */
const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'blockquote',
  'h2',
  'h3',
  'h4',
  'a',
])

/**
 * Элементы, которые снимаются вместе с содержимым: их текст — это код или разметка, показывать нельзя.
 * Остальные неизвестные теги (iframe, svg, math, form…) разворачивает `scrubTag`: тег исчезает,
 * текст остаётся, а все атрибуты, включая `on*`, не переживают allow-list.
 */
const DANGEROUS_ELEMENTS = /<(script|style|noscript|template)\b[\s\S]*?(?:<\/\1\s*>|$)/gi

const TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)\/?>/g

const SAFE_HREF = /^(?:https?:\/\/|mailto:|\/|#)/i
const EXTERNAL_HREF = /^https?:\/\//i

/**
 * HTML из CMS: allow-list тегов, из атрибутов остаётся только безопасный `href` у ссылки,
 * `script`/`style` снимаются вместе с содержимым, инлайн-оформление и обработчики не проходят
 * (свойство не в allow-list, а не «вырезано по шаблону»).
 *
 * Это regex-разбор, а не парсер: для недоверенного HTML нужен `sanitize-html`/DOMPurify —
 * известный долг (ревью волн 3 и 4). Здесь источник — свой CMS через закрытый API.
 */
export function sanitizeApiHtml(html: string | null | undefined): string {
  if (typeof html !== 'string' || !html) return ''

  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(DANGEROUS_ELEMENTS, '')
    .replace(TAG, (_match, closing: string, name: string, attributes: string) =>
      scrubTag(closing, name, attributes),
    )
    .trim()
}

function scrubTag(closing: string, name: string, attributes: string): string {
  const tag = name.toLowerCase()

  if (!ALLOWED_TAGS.has(tag)) return ''
  if (closing) return `</${tag}>`
  if (tag === 'br') return '<br>'

  const href = tag === 'a' ? safeHref(attributes) : ''
  if (!href) return `<${tag}>`

  const external = EXTERNAL_HREF.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''

  return `<a href="${href}"${external}>`
}

/** Атрибуты не разбираем: берём `href` регуляркой и пропускаем только безопасные схемы. */
function safeHref(attributes: string): string {
  const match = /(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attributes)
  const value = (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim()

  return SAFE_HREF.test(value) ? value.replace(/"/g, '&quot;') : ''
}
