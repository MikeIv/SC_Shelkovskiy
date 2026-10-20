import { defineComponent, h } from 'vue'
import { useRulesPage } from '~/composables/api/useRulesPage'

/** Пробник `useRulesPage`: документы, заголовки и признак ошибки ручки. */
export const RulesProbe = defineComponent({
  async setup() {
    clearNuxtData()
    const { page, error } = await useRulesPage()

    return () =>
      h('div', {
        'data-count': String(page.value.documents.length),
        'data-first': page.value.documents[0]?.title ?? '',
        'data-href': page.value.documents[0]?.href ?? '',
        'data-title': page.value.title,
        'data-seo-title': page.value.seoTitle,
        'data-seo-keywords': page.value.seoKeywords ?? '',
        'data-error': String(error.value != null),
      })
  },
})
