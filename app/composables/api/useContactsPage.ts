import type { ApiEnvelope } from '#shared/types/api'
import type { ContactsFeedbackContent, ContactsPageContent } from '#shared/types/contacts'
import type { PageData } from '#shared/types/page'
import { markDemoData, unmarkDemoData } from '~/composables/useDemoData'
import { contactsFeedback, contactsPage } from '~/data/contactsPage'

/**
 * Структура страницы «Контакты»: `GET /api/pages/contacts` (title, SEO, form, map_route).
 * Адрес, телефон, отделы и часы — из `useLayoutStore` (`GET /api/layout`).
 */
export async function useContactsPage() {
  const result = await useApiFetch<ApiEnvelope<PageData>>('/api/pages/contacts')
  const source = '/api/pages/contacts'

  const isFallback = computed(() => result.error.value != null || result.data.value == null)

  const page = computed(() => resolveContactsPage(result.data.value?.data, isFallback.value))

  watch(
    isFallback,
    (demoUsed) => {
      if (demoUsed) markDemoData(source)
      else unmarkDemoData(source)
    },
    { immediate: true },
  )

  return {
    page,
    isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}

export type ContactsPageView = {
  content: ContactsPageContent
  feedback: ContactsFeedbackContent
  seoTitle: string
  seoDescription: string | undefined
  seoOgImage: string | undefined
}

function resolveContactsPage(api: PageData | undefined, forceFallback: boolean): ContactsPageView {
  const live = !forceFallback ? api : undefined
  const title = live?.title || contactsPage.title
  /** Блок `form` → плашка «Нужна помощь?»; модалка остаётся на моке (в API нет тем). */
  const help = live?.form?.kind === 'feedback' ? live.form : null
  const map = live?.mapRoute

  return {
    content: {
      ...contactsPage,
      title,
      helpTitle: help?.title || contactsPage.helpTitle,
      helpText: help?.description || contactsPage.helpText,
      mapPlace: map
        ? {
            title: 'ТРЦ «Щёлковский»',
            address: map.address,
            coordinates: map.coordinates,
          }
        : null,
    },
    feedback: contactsFeedback,
    seoTitle: live?.seo?.title || title,
    seoDescription: live?.seo?.description || undefined,
    seoOgImage: live?.seo?.ogImage || undefined,
  }
}
