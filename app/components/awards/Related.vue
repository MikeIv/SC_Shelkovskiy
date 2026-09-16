<script setup lang="ts">
import type { AwardsItem } from '#shared/types/awards'

const RELATED_TITLE = 'Другие награды и социальные активности'

defineProps<{
  items: readonly AwardsItem[]
}>()

const viewportRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const showNav = ref(false)

function updateNavState() {
  const viewport = viewportRef.value

  if (!viewport) {
    return
  }

  const hasOverflow = viewport.scrollWidth > viewport.clientWidth + 1
  showNav.value = hasOverflow
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

onMounted(() => {
  viewportRef.value?.addEventListener('scroll', updateNavState, { passive: true })
  window.addEventListener('resize', updateNavState)
  updateNavState()
})

onUnmounted(() => {
  viewportRef.value?.removeEventListener('scroll', updateNavState)
  window.removeEventListener('resize', updateNavState)
})
</script>

<template>
  <section
    :class="$style.root"
    aria-labelledby="awards-related-title"
  >
    <div :class="$style.head">
      <h2
        id="awards-related-title"
        :class="$style.title"
      >
        {{ RELATED_TITLE }}
      </h2>

      <div
        v-if="showNav"
        :class="$style.nav"
      >
        <UiButtonArrow
          direction="left"
          :disabled="!canScrollPrev"
          @click="scrollByCard(-1)"
        >
          Предыдущие награды
        </UiButtonArrow>
        <UiButtonArrow
          direction="right"
          :disabled="!canScrollNext"
          @click="scrollByCard(1)"
        >
          Следующие награды
        </UiButtonArrow>
      </div>
    </div>

    <div
      ref="viewportRef"
      :class="$style.viewport"
      aria-roledescription="carousel"
      :aria-label="RELATED_TITLE"
    >
      <ul
        ref="trackRef"
        :class="$style.track"
      >
        <li
          v-for="item in items"
          :key="item.id"
          :class="$style.slide"
        >
          <AwardsCard :item="item" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  width: 100%;
  min-width: 0;
}

.head {
  display: flex;
  gap: var(--fs-space-3);
  align-items: flex-end;
  justify-content: space-between;
}

.title {
  flex: 1 1 auto;
  min-width: 0;
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
  @include fs-carousel-viewport;
}

.track {
  display: flex;
  gap: var(--fs-space-2);
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.slide {
  flex: 0 0 min(100vw - var(--fs-grid-margin) * 2, rem(320));
  scroll-snap-align: start;

  @include from-tablet {
    flex-basis: rem(420);
  }

  @include from-desktop {
    flex-basis: rem(768);
  }
}
</style>
