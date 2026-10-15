import { defineComponent, h } from 'vue'

/**
 * Пробник для composable `useHome`: значения читаются из атрибутов,
 * поэтому тест не зависит от разметки страницы.
 */
export const HomeProbe = defineComponent({
  setup() {
    const { data, demo, isFallback } = useHome()

    return () =>
      h('div', {
        'data-slides': String(data.value.slides.length),
        'data-first-id': data.value.slides[0]?.id ?? '',
        'data-feed': String(data.value.feed.length),
        'data-feed-date': data.value.feed[0]?.date ?? '',
        'data-brands': String(data.value.brands.length),
        'data-gallery': String(data.value.gallery.length),
        'data-fallback': String(isFallback.value),
        'data-demo-slides': String(demo.value.slides),
        'data-demo-feed': String(demo.value.feed),
        'data-demo-brands': String(demo.value.brands),
        'data-demo-gallery': String(demo.value.gallery),
      })
  },
})
