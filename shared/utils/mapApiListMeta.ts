import type { ApiListMeta } from '#shared/types/api'
import { asRecord } from '#shared/utils/apiRecord'

/**
 * `meta` списка Laravel. `null`, если пагинации нет: мок и часть ручек отдают только `data`.
 * Нераспознанные счётчики — тоже `null`, чтобы «показать ещё» не показывалась наугад.
 */
export function mapApiListMeta(value: unknown): ApiListMeta | null {
  const record = asRecord(value)
  if (!record) return null

  const meta: ApiListMeta = {
    current_page: countOf(record.current_page),
    last_page: countOf(record.last_page),
    per_page: countOf(record.per_page),
    total: countOf(record.total),
  }

  if (meta.last_page < 1 || meta.current_page < 1) return null

  return meta
}

function countOf(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 0
  return Math.floor(value)
}
