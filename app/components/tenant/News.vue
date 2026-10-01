<script setup lang="ts">
import type { NewsCardItem } from '#shared/types/news'

defineProps<{
  items: NewsCardItem[]
}>()

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
  <section :class="$style.root" aria-labelledby="tenant-news-title">
    <div :class="$style.head">
      <h2 id="tenant-news-title" :class="$style.title">Новости и акции</h2>

      <div v-if="showNav" :class="$style.nav">
        <UiButtonArrow
          direction="left"
          :disabled="!canScrollPrev"
          @click="scrollByCard(-1)"
        >
          Предыдущие новости
        </UiButtonArrow>
        <UiButtonArrow
          direction="right"
          :disabled="!canScrollNext"
          @click="scrollByCard(1)"
        >
          Следующие новости
        </UiButtonArrow>
      </div>
    </div>

    <div
      ref="viewportRef"
      :class="$style.viewport"
      aria-roledescription="carousel"
      aria-label="Новости и акции"
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
