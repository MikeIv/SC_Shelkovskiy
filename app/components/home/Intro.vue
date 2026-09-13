<script setup lang="ts">
import type { HomeIntroSlide } from '#shared/types/home'

const SLIDE_MS = 10_000

const { slides } = defineProps<{
  slides: HomeIntroSlide[]
}>()

const index = ref(0)
const paused = ref(false)

const current = computed(() => slides[index.value])
const total = computed(() => slides.length)
const canCycle = computed(() => total.value > 1)

function goTo(next: number) {
  const count = total.value

  if (count === 0) {
    return
  }

  index.value = (next + count) % count
}

function prev() {
  goTo(index.value - 1)
}

function next() {
  goTo(index.value + 1)
}

function onProgressEnd() {
  if (!canCycle.value || paused.value) {
    return
  }

  next()
}

function onVisibilityChange() {
  paused.value = document.hidden
}

onMounted(() => {
  onVisibilityChange()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <section
    v-if="current"
    :class="$style.root"
    aria-roledescription="carousel"
    aria-label="Главный слайдер"
  >
    <div :class="$style.viewport">
      <div
        v-for="(slide, i) in slides"
        :key="slide.id"
        :class="[$style.slide, i === index && $style.slideActive]"
        :aria-hidden="i !== index"
      >
        <img
          :class="$style.image"
          :src="slide.imageSrc"
          :alt="i === index ? slide.imageAlt : ''"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'low'"
          decoding="async"
          width="1230"
          height="440"
        />
      </div>
      <div :class="$style.dim" aria-hidden="true" />
    </div>

    <div :class="$style.chrome">
      <div :class="$style.copy">
        <h1 :class="$style.title">{{ current.title }}</h1>
        <p v-if="current.description" :class="$style.desc">
          {{ current.description }}
        </p>
      </div>

      <div
        v-if="canCycle"
        :class="$style.progress"
        :data-paused="paused || undefined"
      >
        <div
          :key="index"
          :class="$style.fill"
          :style="{ animationDuration: `${SLIDE_MS}ms` }"
          @animationend="onProgressEnd"
        />
      </div>

      <div v-if="canCycle" :class="$style.nav">
        <UiButtonArrow variant="light" direction="left" @click="prev">
          Предыдущий слайд
        </UiButtonArrow>
        <p :class="$style.counter" aria-live="polite">
          <span>{{ index + 1 }}</span>
          <span :class="$style.total">/{{ total }}</span>
        </p>
        <UiButtonArrow variant="light" direction="right" @click="next">
          Следующий слайд
        </UiButtonArrow>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  height: rem(750);
  overflow: clip;
  color: var(--fs-color-white);
  background-color: var(--fs-color-black);
  border-end-start-radius: rem(32);
  border-end-end-radius: rem(32);

  @include from-desktop {
    height: rem(900);
    border-end-start-radius: rem(60);
    border-end-end-radius: rem(60);
  }
}

.viewport {
  position: absolute;
  inset: 0;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.slideActive {
  z-index: z('default');
  opacity: 1;
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.dim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-color: rgb(0 0 0 / 40%);
}

.chrome {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  margin-top: auto;
  padding: 0 var(--fs-grid-margin) var(--fs-space-4);

  @include from-desktop {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'copy nav'
      'progress progress';
    column-gap: var(--fs-space-4);
    row-gap: rem(64);
    padding-inline: max(
      var(--fs-grid-margin),
      calc((100% - var(--fs-grid-content-max)) / 2)
    );
    padding-bottom: rem(100);
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;

  @include from-desktop {
    grid-area: copy;
    align-self: end;
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;

  @include from-desktop {
    max-width: rem(1335);
  }
}

.desc {
  display: none;
  margin: 0;
  @include fs-text;
  overflow-wrap: break-word;

  @include from-desktop {
    display: block;
    max-width: rem(1097);
  }
}

.progress {
  position: relative;
  width: 100%;
  height: rem(2);
  overflow: hidden;
  background-color: rgb(255 255 255 / 40%);

  @include from-desktop {
    grid-area: progress;
  }
}

.fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 100%;
  height: 100%;
  background-color: var(--fs-color-white);
  transform: scaleX(0);
  transform-origin: left center;
  animation-name: home-intro-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.progress[data-paused] .fill {
  animation-play-state: paused;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include from-desktop {
    grid-area: nav;
    gap: var(--fs-space-4);
    justify-content: flex-end;
    align-self: end;
  }
}

.counter {
  display: flex;
  gap: var(--fs-space-1);
  align-items: center;
  margin: 0;
  @include fs-h4;
  white-space: nowrap;
}

.total {
  color: var(--fs-color-gray);

  @include from-desktop {
    color: var(--fs-color-light);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fill {
    animation: none;
    transform: scaleX(0);
  }
}

@keyframes home-intro-progress {
  to {
    transform: scaleX(1);
  }
}
</style>
