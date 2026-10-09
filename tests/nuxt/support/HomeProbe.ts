import { defineComponent, h } from 'vue'

/**
 * Пробник для composable `useHome`: значения читаются из атрибутов,
 * поэтому тест не зависит от разметки страницы.
 */
export const HomeProbe = defineComponent({
  setup() {
    const { data, isFallback } = useHome()

    return () =>
      h('div', {
        'data-slides': String(data.value.slides.length),
        'data-first-id': data.value.slides[0]?.id ?? '',
        'data-fallback': String(isFallback.value),
      })
  },
})
