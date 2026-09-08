const DESKTOP_QUERY = '(min-width: 1024px)'

/**
 * Горизонтальная карусель: refs viewport/track, стрелки только на desktop при overflow.
 */
export function useScrollCarousel() {
  const viewportRef = ref<HTMLElement | null>(null)
  const trackRef = ref<HTMLElement | null>(null)
  const canScrollPrev = ref(false)
  const canScrollNext = ref(false)
  const showNav = ref(false)
  const isDesktop = ref(false)

  let desktopMedia: MediaQueryList | null = null

  function updateNavState() {
    const viewport = viewportRef.value

    if (!viewport) {
      return
    }

    const hasOverflow = viewport.scrollWidth > viewport.clientWidth + 1
    showNav.value = isDesktop.value && hasOverflow
    canScrollPrev.value = viewport.scrollLeft > 1
    canScrollNext.value = viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1
  }

  function scrollByCard(direction: -1 | 1) {
    const viewport = viewportRef.value
    const track = trackRef.value
    const card = track?.firstElementChild as HTMLElement | null

    if (!viewport || !track || !card) {
      return
    }

    const styles = getComputedStyle(track)
    const gap = Number.parseFloat(styles.gap || styles.columnGap || '0')

    viewport.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: 'smooth',
    })
  }

  function onDesktopChange(event: MediaQueryListEvent) {
    isDesktop.value = event.matches
    updateNavState()
  }

  onMounted(() => {
    desktopMedia = window.matchMedia(DESKTOP_QUERY)
    isDesktop.value = desktopMedia.matches
    desktopMedia.addEventListener('change', onDesktopChange)

    viewportRef.value?.addEventListener('scroll', updateNavState, {
      passive: true,
    })
    window.addEventListener('resize', updateNavState)
    updateNavState()
  })

  onUnmounted(() => {
    desktopMedia?.removeEventListener('change', onDesktopChange)
    viewportRef.value?.removeEventListener('scroll', updateNavState)
    window.removeEventListener('resize', updateNavState)
  })

  return {
    viewportRef,
    trackRef,
    canScrollPrev,
    canScrollNext,
    showNav,
    scrollByCard,
  }
}
