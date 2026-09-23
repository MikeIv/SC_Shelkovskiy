<script setup lang="ts">
import type { NewsCardItem } from '#shared/types/news'

const RELATED_COPY = {
  news: {
    heading: 'Другие новости',
    prev: 'Предыдущие новости',
    next: 'Следующие новости',
  },
  action: {
    heading: 'Другие акции',
    prev: 'Предыдущие акции',
    next: 'Следующие акции',
  },
  smi: {
    heading: 'Другие публикации',
    prev: 'Предыдущие публикации',
    next: 'Следующие публикации',
  },
} as const

const props = withDefaults(
  defineProps<{
    items: NewsCardItem[]
    kind?: keyof typeof RELATED_COPY
  }>(),
  {
    kind: 'news',
  },
)

const copy = computed(() => RELATED_COPY[props.kind])

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
  <section :class="$style.root" aria-labelledby="news-related-title">
    <div :class="$style.head">
      <h2 id="news-related-title" :class="$style.title">{{ copy.heading }}</h2>

      <div v-if="showNav" :class="$style.nav">
        <UiButtonArrow
          direction="left"
          :disabled="!canScrollPrev"
          @click="scrollByCard(-1)"
        >
          {{ copy.prev }}
        </UiButtonArrow>
        <UiButtonArrow
          direction="right"
          :disabled="!canScrollNext"
          @click="scrollByCard(1)"
        >
          {{ copy.next }}
        </UiButtonArrow>
      </div>
    </div>

    <div
      ref="viewportRef"
      :class="$style.viewport"
      aria-roledescription="carousel"
      :aria-label="copy.heading"
    >
      <ul ref="trackRef" :class="$style.track">
        <li
          v-for="item in items"
          :key="item.id"
          :class="$style.slide"
        >
          <NewsCard layout="catalog" :item="item" />
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
  padding-top: var(--fs-space-6);

  @include from-desktop {
    /* + gap .content (space-5) = 160px до заголовка */
    padding-top: calc(#{rem(160)} - var(--fs-space-5));
  }
}

.head {
  display: flex;
  gap: var(--fs-space-3);
  align-items: center;
  justify-content: space-between;
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
  display: flex;
  flex: 0 0 rem(320);
  scroll-snap-align: start;

  @include from-desktop {
    flex: 0 0 rem(504);
  }
}
</style>
