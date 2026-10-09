import type { ApiSeo } from '#shared/types/seo'
import { asRecord, text } from '#shared/utils/apiRecord'

/** `seo` из API. Пустой объект — `null`: страница не должна затирать заголовок пустыми строками. */
export function mapApiSeo(value: unknown): ApiSeo | null {
  const record = asRecord(value)
  if (!record) return null

  const seo: ApiSeo = {
    title: text(record.title),
    description: text(record.description),
    keywords: text(record.keywords),
    ogImage: text(record.og_image),
  }

  if (!seo.title && !seo.description && !seo.keywords && !seo.ogImage) return null

  return seo
}
