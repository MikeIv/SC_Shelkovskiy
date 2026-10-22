import type { ApiEnvelope } from '#shared/types/api'
import type { AwardsDetailData, AwardsDetailItem, AwardsItem } from '#shared/types/awards'
import { apiErrorInfo } from '#shared/api/errors'
import { getAwardsDetailBySlug, getRelatedAwardsItems } from '~/data/awardsPage'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'

/**
 * Детальная награды и остальные карточки (`exclude`).
 * 404 — страницы нет. Сбой API (5xx, таймаут, CORS) — демо-награда, если slug в ней есть;
 * иначе ошибка с настоящим кодом, без подмены на 404. Отсутствие ответа ошибкой не считаем:
 * до данных награда пустая, а не битая.
 */
export async function useAward(slug: string) {
  const result = await useApiFetch<ApiEnvelope<AwardsDetailData>>(
    `/api/awards/${encodeURIComponent(slug)}`,
  )

  const source = `/api/awards/${slug}`
  const isMissing = computed(() => result.error.value?.statusCode === 404)
  const usesDemo = computed(
    () => !isMissing.value && (result.error.value != null || result.data.value == null),
  )

  const demoDetail = computed(() => getAwardsDetailBySlug(slug) ?? null)

  const item = computed<AwardsDetailItem | null>(() => {
    if (isMissing.value) return null

    if (usesDemo.value) {
      const demo = demoDetail.value

      if (demo) return demo

      /**
       * Ошибка без демо-награды — наружу настоящий код. Пока ответа нет (данные сброшены,
       * запрос в полёте), ошибки тоже нет: показывать нечего, но и падать не из-за чего.
       */
      const error = result.error.value

      if (error == null) return null

      throw createError(apiErrorInfo(error))
    }

    return result.data.value?.data.item ?? null
  })

  const related = computed<readonly AwardsItem[]>(() => {
    if (isMissing.value) return []

    if (usesDemo.value) return getRelatedAwardsItems(slug)
    return result.data.value?.data.related ?? []
  })

  watch(
    usesDemo,
    (demoUsed) => {
      if (demoUsed) markDemoData(source)
      else unmarkDemoData(source)
    },
    { immediate: true },
  )

  return {
    item,
    related,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
