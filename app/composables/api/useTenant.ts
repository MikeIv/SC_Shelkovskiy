import type { ApiEnvelope } from '#shared/types/api'
import type { TenantCatalog, TenantDetail } from '#shared/types/tenantDetail'
import { apiErrorInfo } from '#shared/api/errors'
import { getTenantDetailBySlug } from '~/data/tenantDetails'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'

/**
 * Карточка арендатора.
 * 404 — страницы нет. Сбой API (5xx, таймаут, CORS) — демо-карточка раздела, если slug
 * в ней есть; иначе отдаём ошибку с настоящим кодом. Маскировать сбой под 404 нельзя:
 * недостающие slug'и бэкенд дорабатывает, и живая карточка не должна выглядеть исчезнувшей.
 * Отсутствие ответа ошибкой не считаем: до данных карточка пустая, а не битая.
 */
export async function useTenant(catalog: TenantCatalog, slug: string) {
  const result = await useApiFetch<ApiEnvelope<TenantDetail>>(
    `/api/tenants/${encodeURIComponent(slug)}`,
  )

  const source = `/api/tenants/${slug}`
  const isMissing = computed(() => result.error.value?.statusCode === 404)
  const usesDemo = computed(
    () => !isMissing.value && (result.error.value != null || result.data.value == null),
  )

  const item = computed<TenantDetail | null>(() => {
    if (isMissing.value) return null

    if (usesDemo.value) {
      const demo = getTenantDetailBySlug(catalog, slug)

      if (demo) return demo

      /**
       * Ошибка без демо-карточки — наружу настоящий код. Пока ответа нет (данные сброшены,
       * запрос в полёте), ошибки тоже нет: показывать нечего, но и падать не из-за чего.
       */
      const error = result.error.value

      if (error == null) return null

      throw createError(apiErrorInfo(error))
    }

    return result.data.value?.data ?? null
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
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
