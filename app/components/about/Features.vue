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
    <img
      :class="$style.pattern"
      src="/images/about/watermark.svg"
      alt=""
      width="1348"
      height="1344"
      aria-hidden="true"
      decoding="async"
    >

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
  position: relative;
  overflow-x: clip;
}

.pattern {
  position: absolute;
  top: rem(-200);
  left: rem(-280);
  width: min(140%, rem(640));
  height: auto;
  max-width: none;
  pointer-events: none;
  opacity: 0.08;

  @include from-desktop {
    top: rem(-320);
    left: rem(-120);
    width: rem(1100);
  }
}

.inner {
  position: relative;
  z-index: z('default');
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
  position: relative;
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
  max-width: rem(1105);

  @include from-desktop {
    max-width: none;
    width: 100%;
    padding-inline-end: rem(248);
  }
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
    position: absolute;
    right: 0;
    bottom: 0;
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
