<script setup lang="ts">
import type { HomeIntroSlide } from '#shared/types/home'

const SLIDE_MS = 10_000
const DESKTOP_MQ = '(min-width: 1280px)'

/**
 * Слайд занимает всю ширину экрана на всех брейкпоинтах. Размеры кадров (широкого и
 * портретного) задаёт админка, поэтому пропорции не фиксируем — варианты строит ipx.
 * `sm` + `2xl` дают четыре ширины (640/1280/1536/3072) вместо набора по всем брейкпоинтам.
 */
const SLIDE_SIZES = 'sm:100vw 2xl:100vw'

const img = useImage()

const { slides, isDemo = false } = defineProps<{
  slides: HomeIntroSlide[]
  /** Раздел подставлен из мока — ярлык «Демо-данные». */
  isDemo?: boolean
}>()

/** Кадр слайда: `srcset`/`sizes` из ipx, без зашитых размеров. */
type IntroFrameImage = {
  src: string
  srcset?: string
  sizes?: string
}

type IntroFrame = {
  slide: HomeIntroSlide
  image: IntroFrameImage
  /** Широкий кадр для desktop; без него слайд использует один кадр на всех экранах. */
  desktopImage?: IntroFrameImage
}

const index = ref(0)
const userPaused = ref(false)
const hiddenPaused = ref(false)

const paused = computed(() => userPaused.value || hiddenPaused.value)
const current = computed(() => slides[index.value])
const total = computed(() => slides.length)
const frames = computed<IntroFrame[]>(() => slides.map(introFrame))
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

function togglePause() {
  userPaused.value = !userPaused.value
}

function onProgressEnd() {
  if (!canCycle.value || paused.value) {
    return
  }

  next()
}

function onVisibilityChange() {
  hiddenPaused.value = document.hidden
}

function frameImage(source: string): IntroFrameImage {
  const { src, srcset, sizes } = img.getSizes(source, {
    sizes: SLIDE_SIZES,
    modifiers: { format: 'webp' },
  })

  return {
    src: src ?? source,
    ...(srcset ? { srcset } : {}),
    ...(sizes ? { sizes } : {}),
  }
}

function introFrame(slide: HomeIntroSlide): IntroFrame {
  if (!slide.imageSrcMobile) {
    return { slide, image: frameImage(slide.imageSrc) }
  }

  return {
    slide,
    image: frameImage(slide.imageSrcMobile),
    desktopImage: frameImage(slide.imageSrc),
  }
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
        v-for="(frame, i) in frames"
        :key="frame.slide.id"
        :class="[$style.slide, i === index && $style.slideActive]"
        :aria-hidden="i !== index"
      >
        <picture :class="$style.picture">
          <source
            v-if="frame.desktopImage"
            :srcset="frame.desktopImage.srcset"
            :sizes="frame.desktopImage.sizes"
            :media="DESKTOP_MQ"
            type="image/webp"
          >
          <img
            :class="$style.image"
            :src="frame.image.src"
            :srcset="frame.image.srcset"
            :sizes="frame.image.sizes"
            :alt="i === index ? frame.slide.imageAlt : ''"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :fetchpriority="i === 0 ? 'high' : 'low'"
            decoding="async"
          >
        </picture>
      </div>
      <div :class="$style.dim" aria-hidden="true" />
    </div>

    <UiDemoDataBadge v-if="isDemo" :class="$style.demo" />

    <div :class="$style.chrome">
      <div :class="$style.copy">
        <h2 v-if="current.title" :class="$style.title">{{ current.title }}</h2>
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
        <button
          :class="$style.pause"
          type="button"
          :aria-pressed="userPaused"
          @click="togglePause"
        >
          {{ userPaused ? 'Запустить слайдер' : 'Пауза слайдера' }}
        </button>
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
  color: var(--fs-color-white);
  background-color: var(--fs-color-black);
  overflow: clip;
  border-end-start-radius: var(--fs-radius-3xl);
  border-end-end-radius: var(--fs-radius-3xl);

  @include from-desktop {
    height: rem(900);
    border-end-start-radius: var(--fs-radius-4xl);
    border-end-end-radius: var(--fs-radius-4xl);
  }
}

/* Ниже шапки, чтобы не перекрывать логотип и меню. */
.demo {
  position: absolute;
  top: rem(84);
  left: var(--fs-grid-margin);
  z-index: z('default');
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

.picture {
  display: block;
  width: 100%;
  height: 100%;
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
  background-color: rgb(0 0 0 / 40%);
  pointer-events: none;
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
    row-gap: rem(64);
    column-gap: var(--fs-space-4);
    padding-bottom: rem(100);
    padding-inline: max(
      var(--fs-grid-margin),
      calc((100% - var(--fs-grid-content-max)) / 2)
    );
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
  background-color: rgb(255 255 255 / 40%);
  overflow: hidden;

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
  animation-name: home-intro-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  transform: scaleX(0);
  transform-origin: left center;
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
    align-self: end;
    justify-content: flex-end;
  }
}

.pause {
  /* Absolute и при фокусе — иначе прыгает flex .nav (space-between). */
  position: absolute;
  inset-block: 0;
  left: 50%;
  z-index: z('default');
  width: 1px;
  height: 1px;
  margin-block: auto;
  padding: 0;
  border: 0;
  color: var(--fs-color-white);
  white-space: nowrap;
  background: transparent;
  overflow: hidden;
  appearance: none;
  clip-path: inset(50%);
  transform: translateX(-50%);

  &:focus-visible {
    width: auto;
    height: auto;
    padding: rem(8) rem(12);
    border-radius: var(--fs-radius-sm);
    white-space: nowrap;
    overflow: visible;
    cursor: pointer;
    outline: rem(2) solid var(--fs-color-white);
    clip-path: none;
    outline-offset: rem(2);
    @include fs-text-sm;
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
