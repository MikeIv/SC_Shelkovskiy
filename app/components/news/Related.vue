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

const {
  viewportRef,
  trackRef,
  canScrollPrev,
  canScrollNext,
  showNav,
  scrollByCard,
} = useScrollCarousel()
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
  /* Гасит горизонтальный скролл fs-carousel-viewport. */
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  width: 100%;
  min-width: 0;
  overflow-x: clip;
  /* + gap .content (space-4 / desk space-5) → --fs-space-section до блока */
  padding-top: calc(var(--fs-space-section) - var(--fs-space-4));

  @include from-desktop {
    gap: var(--fs-space-5);
    padding-top: calc(var(--fs-space-section) - var(--fs-space-5));
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
