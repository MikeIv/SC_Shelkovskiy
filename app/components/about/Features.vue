<script setup lang="ts">
import type { AboutFeature } from '#shared/types/about'

const { title, description, items } = defineProps<{
  title: string
  description: string
  items: AboutFeature[]
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
  <section :class="$style.root" aria-labelledby="about-features-title">
    <div :class="$style.inner">
      <div :class="$style.head">
        <div :class="$style.copy">
          <h2 id="about-features-title" :class="$style.title">{{ title }}</h2>
          <p :class="$style.desc">{{ description }}</p>
        </div>

        <div v-if="showNav" :class="$style.nav">
          <UiButtonArrow
            direction="left"
            :disabled="!canScrollPrev"
            @click="scrollByCard(-1)"
          >
            Предыдущие направления
          </UiButtonArrow>
          <UiButtonArrow
            direction="right"
            :disabled="!canScrollNext"
            @click="scrollByCard(1)"
          >
            Следующие направления
          </UiButtonArrow>
        </div>
      </div>

      <div
        ref="viewportRef"
        :class="$style.viewport"
        aria-roledescription="carousel"
        aria-label="Направления торгового центра"
      >
        <ul ref="trackRef" :class="$style.track">
          <li
            v-for="item in items"
            :key="item.id"
            :class="$style.slide"
          >
            <AboutFeatureCard :feature="item" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  overflow-x: clip;
  padding-block: rem(60) 0;

  @include from-desktop {
    padding-block: rem(80) 0;
  }
}

.inner {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;
  padding-inline: var(--fs-grid-margin);

  @include from-desktop {
    gap: var(--fs-space-5);
  }
}

.head {
  display: flex;
  gap: var(--fs-space-3);
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
  max-width: rem(1105);
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.desc {
  margin: 0;
  @include fs-text-lg;
  max-width: rem(564);
  overflow-wrap: break-word;
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
  flex: 0 0 min(100vw - 2 * var(--fs-grid-margin), rem(320));
  scroll-snap-align: start;

  @include from-desktop {
    flex: 0 0 rem(900);
  }
}
</style>
