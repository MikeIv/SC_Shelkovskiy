import type { ApiEnvelope } from '#shared/types/api'
import type { ContactsFeedbackContent, ContactsPageContent } from '#shared/types/contacts'
import type { PageData } from '#shared/types/page'
import { contactsFeedback, contactsPage, contactsPageApi } from '~/data/contactsPage'
import { siteName } from '~/data/siteMeta'

/** Что читает страница «Контакты»: контент, форма помощи и SEO. */
export type ContactsPageView = {
  content: ContactsPageContent
  feedback: ContactsFeedbackContent
  seoTitle: string
  seoDescription: string | undefined
  seoOgImage: string | undefined
}

/**
 * Структура страницы «Контакты»: `GET /api/pages/contacts` (title, SEO, form, map_route).
 * Адрес, телефон, отделы и часы — из `useLayoutStore` (`GET /api/layout`),
 * пустой ответ ручки подменяется моком (`useApiData`).
 */
export function useContactsPage() {
  const result = useApiData<ApiEnvelope<PageData>>('/api/pages/contacts', () => ({
    data: contactsPageApi,
  }))

  const page = computed(() => resolveContactsPage(result.data.value.data))

  return {
    page,
    isFallback: result.isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}

/** Мок страницы — база: поля, которые ручка отдала, встают поверх него. */
function resolveContactsPage(api: PageData): ContactsPageView {
  const title = api.title || contactsPage.title
  /** Блок `form` → плашка «Нужна помощь?»; модалка остаётся на моке (в API нет тем). */
  const help = api.form?.kind === 'feedback' ? api.form : null
  const map = api.mapRoute

  return {
    content: {
      ...contactsPage,
      title,
      helpTitle: help?.title || contactsPage.helpTitle,
      helpText: help?.description || contactsPage.helpText,
      mapPlace: map
        ? {
            title: siteName,
            address: map.address,
            coordinates: map.coordinates,
          }
        : null,
    },
    feedback: contactsFeedback,
    seoTitle: api.seo?.title || title,
    seoDescription: api.seo?.description || undefined,
    seoOgImage: api.seo?.ogImage || undefined,
  }
}
