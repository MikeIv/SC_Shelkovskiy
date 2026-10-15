<script setup lang="ts">
import type { NewsCardItem } from '#shared/types/news'

const { items, isDemo = false } = defineProps<{
  items: NewsCardItem[]
  /** Раздел подставлен из мока — ярлык «Демо-данные». */
  isDemo?: boolean
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
  <section :class="$style.root" aria-labelledby="home-news-title">
    <div :class="$style.pattern" aria-hidden="true" />

    <div :class="$style.inner">
      <div :class="$style.head">
        <div :class="$style.headTitle">
          <h2 id="home-news-title" :class="$style.title">Новости и акции</h2>
          <UiDemoDataBadge v-if="isDemo" />
        </div>

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
            <NewsCard layout="slider" :item="item" />
          </li>
        </ul>
      </div>

      <UiButton to="/news">Смотреть все</UiButton>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  /* Контекст для z-index:-1; clip гасит скролл карусели. */
  position: relative;
  z-index: 0;
  overflow-x: clip;
}

/* Figma 687:49135 — слева; desk: центр на левом крае (−674 / 1348×1344). */
.pattern {
  position: absolute;
  top: rem(-80);
  left: rem(-194);
  z-index: -1;
  width: rem(374);
  height: rem(373);
  background-color: var(--fs-color-ornament);
  pointer-events: none;
  mask: url('/images/home/categories/pattern.svg') center / contain no-repeat;

  @include from-tablet {
    top: rem(-100);
    left: 0;
    width: rem(725);
    height: rem(723);
    transform: translateX(-50%);
  }

  @include from-desktop {
    top: rem(-372);
    width: rem(1348);
    height: rem(1344);
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

.headTitle {
  display: flex;
  flex-wrap: wrap;
  gap: rem(12);
  align-items: center;
  min-width: 0;
}

.title {
  margin: 0;
  @include fs-h1;
  color: var(--fs-color-black);
}

.nav {
  display: none;
  flex-shrink: 0;
  gap: var(--fs-space-4);
  align-items: center;

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
