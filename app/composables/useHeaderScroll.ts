import type { Ref } from 'vue'

const TOP_EPSILON = 2
const DIRECTION_DELTA = 6

/**
 * Поведение header при скролле (aviapark-like):
 * — уход с верха: сворачивается nav, закрепляется top-bar;
 * — скролл вниз: прячется; вверх: появляется.
 */
export function useHeaderScroll(
  options: {
    pauseHide?: Ref<boolean>
  } = {},
) {
  const pinned = ref(false)
  const hidden = ref(false)

  let lastY = 0
  let frame = 0

  function applyScroll(): void {
    if (!import.meta.client) {
      return
    }

    const y = Math.max(0, window.scrollY)
    const delta = y - lastY

    if (y <= TOP_EPSILON) {
      pinned.value = false
      hidden.value = false
      lastY = y
      return
    }

    const justPinned = !pinned.value
    pinned.value = true

    if (options.pauseHide?.value || justPinned) {
      hidden.value = false
    } else if (delta > DIRECTION_DELTA) {
      hidden.value = true
    } else if (delta < -DIRECTION_DELTA) {
      hidden.value = false
    }

    lastY = y
  }

  function onScroll(): void {
    if (frame) {
      return
    }

    frame = window.requestAnimationFrame(() => {
      frame = 0
      applyScroll()
    })
  }

  onMounted(() => {
    lastY = Math.max(0, window.scrollY)
    applyScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (frame) {
      window.cancelAnimationFrame(frame)
    }
  })

  if (options.pauseHide) {
    watch(options.pauseHide, (paused) => {
      if (paused) {
        hidden.value = false
      }
    })
  }

  return {
    pinned,
    hidden,
  }
}
