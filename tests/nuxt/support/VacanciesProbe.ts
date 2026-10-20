import { defineComponent, h } from 'vue'
import { useVacancies } from '~/composables/api/useVacancies'

/**
 * Пробник `useVacancies`: значения читаются из атрибутов, поэтому тест не зависит
 * от разметки аккордеона.
 */
export const VacanciesProbe = defineComponent({
  setup() {
    clearNuxtData()
    const { items, isFallback } = useVacancies()

    return () =>
      h('div', {
        'data-count': String(items.value.length),
        'data-first': items.value[0]?.title ?? '',
        'data-phone': items.value[0]?.contacts?.phoneHref ?? '',
        'data-fallback': String(isFallback.value),
      })
  },
})
