import { describe, expect, it } from 'vitest'
import { sanitizeApiHtml } from '#shared/utils/sanitizeApiHtml'

describe('sanitizeApiHtml', () => {
  it('снимает script и style вместе с содержимым', () => {
    expect(sanitizeApiHtml('<p>Первый</p><script>bad()</script><style>p{color:red}</style>')).toBe(
      '<p>Первый</p>',
    )
  })

  it('не пропускает обработчики без кавычек и опасные схемы', () => {
    expect(sanitizeApiHtml('<img src=x onerror=alert(1)>')).toBe('')
    expect(sanitizeApiHtml('<svg onload=alert(1)>текст</svg>')).toBe('текст')
    expect(sanitizeApiHtml('<iframe src="https://example.invalid"></iframe>')).toBe('')
    expect(sanitizeApiHtml('<a href="javascript:alert(1)">Ссылка</a>')).toBe('<a>Ссылка</a>')
    expect(sanitizeApiHtml('<a href="data:text/html;base64,PHM+">Ссылка</a>')).toBe('<a>Ссылка</a>')
  })

  it('снимает инлайн-оформление и классы CMS', () => {
    const html =
      '<p style="color: red" class="lead" onclick="bad()">Первый</p><p style=color:blue>Второй</p>'

    expect(sanitizeApiHtml(html)).toBe('<p>Первый</p><p>Второй</p>')
  })

  it('оставляет разрешённую разметку и безопасные ссылки', () => {
    expect(sanitizeApiHtml('<p><strong>Важно</strong></p><ul><li>Пункт</li></ul>')).toBe(
      '<p><strong>Важно</strong></p><ul><li>Пункт</li></ul>',
    )
    expect(sanitizeApiHtml('<a href="/map">Схема</a>')).toBe('<a href="/map">Схема</a>')
    expect(sanitizeApiHtml('<a href="https://example.invalid">Сайт</a>')).toBe(
      '<a href="https://example.invalid" target="_blank" rel="noopener noreferrer">Сайт</a>',
    )
  })

  it('пустое значение — пустая строка', () => {
    expect(sanitizeApiHtml(null)).toBe('')
    expect(sanitizeApiHtml(undefined)).toBe('')
    expect(sanitizeApiHtml('')).toBe('')
    expect(sanitizeApiHtml('   ')).toBe('')
  })
})
