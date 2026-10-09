import { defineComponent, h } from 'vue'

/** Пробник `useSiteLayout`: значения читаются из атрибутов, без разметки страницы. */
export const LayoutProbe = defineComponent({
  async setup() {
    const { data, isFallback } = await useSiteLayout()
    const store = useLayoutStore()

    return () =>
      h('div', {
        'data-fallback': String(isFallback.value),
        'data-social': data.value.socials[0]?.label ?? '',
        'data-phone': data.value.contacts.phone,
        'data-week': String(data.value.hours.week.length),
        'data-loaded': String(store.loaded),
        'data-store-social': store.socials[0]?.label ?? '',
      })
  },
})
