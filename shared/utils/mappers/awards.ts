import type { AwardsItem, AwardsDetailItem } from '#shared/types/awards'
import { asRecord, text } from '#shared/utils/apiRecord'
import { formatApiDate } from '#shared/utils/formatApiDate'
import { mapApiSeo } from '#shared/utils/mapApiSeo'
import { resolveAlt } from '#shared/utils/resolveAlt'
import { sanitizeApiHtml } from '#shared/utils/sanitizeApiHtml'

/** Пустой абзац из CMS: обычный пробел, неразрывный и одиночный перенос. */
const EMPTY_PARAGRAPH = /<p>(?:\s|&nbsp;|<br>)*<\/p>/gi

function collapseEmptyParagraphs(html: string): string {
  return html.replace(EMPTY_PARAGRAPH, '').trim()
}

/** Список `GET /awards`: карточки без даты остаются, без slug или title — нет. */
export function mapAwardCards(items: readonly unknown[]): AwardsItem[] {
  return items.flatMap((item) => {
    const mapped = mapAwardCard(item)
    return mapped ? [mapped] : []
  })
}

export function mapAwardCard(item: unknown): AwardsItem | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const id = text(record.slug)
  const title = text(record.title)
  if (!id || !title) return undefined

  const dateIso = text(record.date)
  const date = formatApiDate(dateIso, { numeric: true })

  return {
    id,
    date,
    dateIso: date ? dateIso : '',
    title,
  }
}

/**
 * Детальная `GET /awards/{slug}`: карточка плюс `subtitle`, HTML `text`, `image`, `seo`.
 * `subtitle`, `text` и `date` на стенде бывают `null` — пустые поля в вёрстке не выводятся.
 */
export function mapAwardDetail(data: unknown): AwardsDetailItem | undefined {
  const card = mapAwardCard(data)
  if (!card) return undefined

  const record = asRecord(data)
  if (!record) return undefined

  return {
    ...card,
    subtitle: text(record.subtitle),
    paragraphs: [],
    bodyHtml: collapseEmptyParagraphs(sanitizeApiHtml(text(record.text))),
    imageSrc: text(record.image),
    imageAlt: resolveAlt(card.title),
    seo: mapApiSeo(record.seo),
  }
}
