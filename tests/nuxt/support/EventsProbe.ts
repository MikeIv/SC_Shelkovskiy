import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import type { EventDetailItem } from '#shared/types/events'
import type { LayoutCtaMax } from '#shared/types/layout'
import EventsDetailArticle from '~/components/events/DetailArticle.vue'

/** Пробник `useEvents`: афиша из API или мока. */
export const EventsProbe = defineComponent({
  async setup() {
    clearNuxtData()
    const { items, isFallback } = await useEvents()

    return () =>
      h('div', {
        'data-count': String(items.value.length),
        'data-first': items.value[0]?.title ?? '',
        'data-fallback': String(isFallback.value),
      })
  },
})

/** Пробник попапа регистрации: кладёт `cta_max` в стор и рендерит детальную мероприятия. */
export const EventsCtaProbe = defineComponent({
  props: {
    item: { type: Object as PropType<EventDetailItem>, required: true },
    cta: { type: Object as PropType<LayoutCtaMax | null>, default: null },
  },
  setup(props) {
    const store = useLayoutStore()
    store.ctaMax = props.cta

    return () => h(EventsDetailArticle, { item: props.item })
  },
})

/** Пробник `useEvent`: детальная мероприятия. */
export const EventProbe = defineComponent({
  props: {
    slug: { type: String, required: true },
  },
  async setup(props) {
    clearNuxtData()
    const { item } = await useEvent(props.slug)

    return () =>
      h('div', {
        'data-title': item.value?.title ?? '',
        'data-when': item.value?.when ?? '',
        'data-program': String(item.value?.program?.length ?? ''),
        'data-body': item.value?.bodyHtml ?? '',
        'data-register': String(item.value?.register ?? ''),
      })
  },
})
