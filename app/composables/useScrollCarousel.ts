/** Пороги совпадают с `from-tablet` / `from-desktop` (`variables/resolutions.scss`). */
const TABLET_QUERY = '(min-width: 768px)'
const DESKTOP_QUERY = '(min-width: 1280px)'

/**
 * Горизонтальная карусель: refs viewport/track, стрелки при overflow.
 * `showNav` — стрелки в шапке: только desktop (≥1280).
 * `showFootNav` — стрелки под каруселью: только mobile (<768); на планшете
 * стрелок нет по макету, навигация — свайпом.
 */
export function useScrollCarousel() {
  const viewportRef = ref<HTMLElement | null>(null)
  const trackRef = ref<HTMLElement | null>(null)
  const canScrollPrev = ref(false)
  const canScrollNext = ref(false)
  const hasOverflow = ref(false)
  const isTabletUp = ref(false)
  const isDesktop = ref(false)
  const showNav = computed(() => isDesktop.value && hasOverflow.value)
  const showFootNav = computed(() => !isTabletUp.value && hasOverflow.value)

  let tabletMedia: MediaQueryList | null = null
  let desktopMedia: MediaQueryList | null = null

  function updateNavState() {
    const viewport = viewportRef.value

    if (!viewport) {
      return
    }

    hasOverflow.value = viewport.scrollWidth > viewport.clientWidth + 1
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

  function onTabletChange(event: MediaQueryListEvent) {
    isTabletUp.value = event.matches
  }

  function onDesktopChange(event: MediaQueryListEvent) {
    isDesktop.value = event.matches
  }

  onMounted(() => {
    tabletMedia = window.matchMedia(TABLET_QUERY)
    isTabletUp.value = tabletMedia.matches
    tabletMedia.addEventListener('change', onTabletChange)

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
    tabletMedia?.removeEventListener('change', onTabletChange)
    desktopMedia?.removeEventListener('change', onDesktopChange)
    viewportRef.value?.removeEventListener('scroll', updateNavState)
    window.removeEventListener('resize', updateNavState)
  })

  return {
    viewportRef,
    trackRef,
    canScrollPrev,
    canScrollNext,
    hasOverflow,
    isDesktop,
    showNav,
    showFootNav,
    scrollByCard,
  }
}
