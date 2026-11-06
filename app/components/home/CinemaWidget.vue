<script setup lang="ts">
import type { AfishaWidgetInstance } from '#shared/types/afishaWidget'

/**
 * Встроенное расписание кинотеатра ТРЦ от Афиши.
 *
 * Нужно там, где нет серверных данных (статический стенд): iframe виджета клиентский,
 * партнёрский ключ и белый список IP ему не нужны. Если SDK не поднялся, сообщаем наверх —
 * раздел покажет карточки-заглушки.
 */

/** iframe Афиши тяжёлый: подключаем его до подхода к экрану, но не при загрузке главной. */
const MOUNT_MARGIN = '400px'

const emit = defineEmits<{ failed: [] }>()

const containerRef = ref<HTMLElement | null>(null)
const { mountPlaceWidget } = useAfishaWidget()

let observer: IntersectionObserver | null = null
let widget: AfishaWidgetInstance | undefined
/** Раздел размонтировали раньше, чем ответил SDK: iframe снимаем сразу после подключения. */
let disposed = false

async function mountWidget(container: HTMLElement) {
  const instance = await mountPlaceWidget(container)

  if (disposed) {
    void instance?.destroy?.()

    return
  }

  if (!instance) {
    emit('failed')

    return
  }

  widget = instance
}

function stopObserver() {
  observer?.disconnect()
  observer = null
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  if (typeof IntersectionObserver === 'undefined') {
    void mountWidget(container)

    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return

      stopObserver()
      void mountWidget(container)
    },
    { rootMargin: MOUNT_MARGIN },
  )

  observer.observe(container)
})

onBeforeUnmount(() => {
  disposed = true
  stopObserver()
  void widget?.destroy?.()
})
</script>

<template>
  <div ref="containerRef" :class="$style.root" />
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  /* Высота как у inline-виджета Афиши: место под iframe занято до загрузки SDK. */
  width: 100%;
  min-height: rem(680);
}
</style>
