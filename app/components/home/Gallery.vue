<script setup lang="ts">
import type { HomeGalleryAlbum } from '#shared/types/home'

const DESKTOP_QUERY = '(min-width: 1024px)'

const { items } = defineProps<{
  items: HomeGalleryAlbum[]
}>()

const viewportRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const showHeadNav = ref(false)
const showFootNav = ref(false)
const isDesktop = ref(false)
const activeAlbum = ref<HomeGalleryAlbum | null>(null)

let desktopMedia: MediaQueryList | null = null

function openAlbum(album: HomeGalleryAlbum): void {
  if (!album.photos?.length) {
    return
  }

  activeAlbum.value = album
}

function closeLightbox(): void {
  activeAlbum.value = null
}

function updateNavState() {
  const viewport = viewportRef.value

  if (!viewport) {
    return
  }

  const hasOverflow = viewport.scrollWidth > viewport.clientWidth + 1
  showHeadNav.value = isDesktop.value && hasOverflow
  showFootNav.value = !isDesktop.value && hasOverflow
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

  viewport.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
}

function onDesktopChange(event: MediaQueryListEvent) {
  isDesktop.value = event.matches
  updateNavState()
}

onMounted(() => {
  desktopMedia = window.matchMedia(DESKTOP_QUERY)
  isDesktop.value = desktopMedia.matches
  desktopMedia.addEventListener('change', onDesktopChange)

  viewportRef.value?.addEventListener('scroll', updateNavState, { passive: true })
  window.addEventListener('resize', updateNavState)
  updateNavState()
})

onUnmounted(() => {
  desktopMedia?.removeEventListener('change', onDesktopChange)
  viewportRef.value?.removeEventListener('scroll', updateNavState)
  window.removeEventListener('resize', updateNavState)
})
</script>

<template>
  <section :class="$style.root" aria-labelledby="home-gallery-title">
    <div :class="$style.inner">
      <div :class="$style.head">
        <h2 id="home-gallery-title" :class="$style.title">Галерея</h2>

        <div v-if="showHeadNav" :class="$style.nav">
          <UiButtonArrow
            direction="left"
            :disabled="!canScrollPrev"
            @click="scrollByCard(-1)"
          >
            Предыдущие альбомы
          </UiButtonArrow>
          <UiButtonArrow
            direction="right"
            :disabled="!canScrollNext"
            @click="scrollByCard(1)"
          >
            Следующие альбомы
          </UiButtonArrow>
        </div>
      </div>

      <div
        ref="viewportRef"
        :class="$style.viewport"
        aria-roledescription="carousel"
        aria-label="Галерея"
      >
        <ul ref="trackRef" :class="$style.track">
          <li
            v-for="item in items"
            :key="item.id"
            :class="$style.slide"
          >
            <HomeGalleryCard
              v-bind="item"
              @select="openAlbum(item)"
            />
          </li>
        </ul>
      </div>

      <div v-if="showFootNav" :class="$style.footNav">
        <UiButtonArrow
          direction="left"
          :disabled="!canScrollPrev"
          @click="scrollByCard(-1)"
        >
          Предыдущие альбомы
        </UiButtonArrow>
        <UiButtonArrow
          direction="right"
          :disabled="!canScrollNext"
          @click="scrollByCard(1)"
        >
          Следующие альбомы
        </UiButtonArrow>
      </div>

      <UiButton :class="$style.allBtn" to="/gallery">Смотреть все</UiButton>
    </div>

    <GalleryLightbox
      :open="activeAlbum !== null"
      :images="activeAlbum?.photos ?? []"
      :alt="activeAlbum?.imageAlt ?? ''"
      @close="closeLightbox"
    />
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  padding-block: rem(60) var(--fs-space-6);

  @include from-desktop {
    padding-block: rem(80) var(--fs-space-6);
  }
}

.inner {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;
  padding-inline: var(--fs-grid-margin);

  @include from-tablet {
    align-items: center;
  }

  @include from-desktop {
    gap: var(--fs-space-5);
  }
}

.head {
  display: flex;
  gap: var(--fs-space-3);
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.title {
  margin: 0;
  @include fs-h1;
  color: var(--fs-color-black);
}

.nav {
  display: none;
  gap: var(--fs-space-4);
  align-items: center;
  flex-shrink: 0;

  @include from-desktop {
    display: flex;
  }
}

.viewport {
  width: calc(100% + 2 * var(--fs-grid-margin));
  margin-inline: calc(-1 * var(--fs-grid-margin));
  padding-inline: var(--fs-grid-margin);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.track {
  display: flex;
  gap: var(--fs-space-3);
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
}

.slide {
  flex: 0 0 calc(100vw - 2 * var(--fs-grid-margin));
  scroll-snap-align: start;

  @include from-desktop {
    flex: 0 0 rem(768);
  }
}

.footNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @include from-desktop {
    display: none;
  }
}

.allBtn {
  display: none;

  @include from-desktop {
    display: inline-flex;
  }
}
</style>
