<script setup lang="ts">
import type { HomeBrandRow } from '#shared/types/home'

const { rows, flush = false, isDemo = false } = defineProps<{
  rows: HomeBrandRow[]
  flush?: boolean
  /** Раздел подставлен из мока — ярлык «Демо-данные». */
  isDemo?: boolean
}>()

const paused = ref(false)
const mediaSrc = useMediaSrc()

function togglePause() {
  paused.value = !paused.value
}
</script>

<template>
  <section
    :class="[$style.root, flush && $style.flush]"
    aria-label="Бренды торгового центра"
  >
    <UiDemoDataBadge v-if="isDemo" :class="$style.demo" />

    <button
      :class="$style.pause"
      type="button"
      :aria-pressed="paused"
      @click="togglePause"
    >
      {{ paused ? 'Запустить прокрутку брендов' : 'Пауза прокрутки брендов' }}
    </button>

    <div
      v-for="row in rows"
      :key="row.id"
      :class="$style.row"
    >
      <div
        :class="[
          $style.track,
          row.direction === 'rtl' ? $style.trackRtl : $style.trackLtr,
        ]"
        :data-paused="paused || undefined"
      >
        <ul
          v-for="copy in 2"
          :key="`${row.id}-${copy}`"
          :class="$style.list"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <li
            v-for="item in row.items"
            :key="`${row.id}-${copy}-${item.id}`"
            :class="$style.item"
          >
            <div
              :class="[
                $style.logo,
                item.shape === 'circle' ? $style.logoCircle : $style.logoSquircle,
              ]"
            >
              <img
                :src="mediaSrc(item.imageSrc, 320)"
                :alt="item.imageAlt"
                :class="[
                  $style.logoImage,
                  item.imageCrop === 'wide' && $style.logoImageWide,
                  item.imageCrop === 'ekonika' && $style.logoImageEkonika,
                ]"
                width="152"
                height="163"
                loading="lazy"
                decoding="async"
              >
            </div>
            <span :class="$style.name">{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  --marquee-duration: 30s;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  padding-block: var(--fs-space-6) rem(100);
  overflow: hidden;

  @include from-desktop {
    gap: var(--fs-space-3);
    padding-block: var(--fs-space-6) rem(140);
  }

  &.flush {
    padding-block: 0;
  }
}

.demo {
  position: absolute;
  top: 0;
  left: var(--fs-grid-margin);
  z-index: z('default');
}

.pause {
  position: absolute;
  top: var(--fs-space-3);
  right: var(--fs-space-3);
  z-index: z('default');
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  color: var(--fs-color-black);
  white-space: nowrap;
  background-color: var(--fs-color-white);
  overflow: hidden;
  appearance: none;
  clip-path: inset(50%);

  &:focus-visible {
    width: auto;
    height: auto;
    padding: rem(6) rem(12);
    border: rem(1) solid var(--fs-color-gray);
    border-radius: var(--fs-radius-sm);
    overflow: visible;
    cursor: pointer;
    outline: rem(2) solid var(--fs-color-black);
    clip-path: none;
    outline-offset: rem(2);
    @include fs-text-sm;
  }
}

.row {
  overflow: hidden;
}

.track {
  display: flex;
  width: max-content;
  animation-duration: var(--marquee-duration);
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  &[data-paused] {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.trackRtl {
  animation-name: home-brands-marquee-rtl;
}

.trackLtr {
  animation-name: home-brands-marquee-ltr;
}

.list {
  display: flex;
  flex-shrink: 0;
  gap: rem(48);
  align-items: center;
  margin: 0;
  padding-inline: rem(24);
  list-style: none;

  @include from-desktop {
    gap: rem(60);
    padding-inline: rem(30);
  }
}

.item {
  display: flex;
  flex-shrink: 0;
  gap: rem(32);
  align-items: center;
}

.logo {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}

.logoSquircle {
  width: rem(110);
  height: rem(132);
  border-radius: var(--fs-radius-3xl);

  @include from-desktop {
    width: rem(122);
    height: rem(147);
  }
}

.logoCircle {
  width: rem(131);
  height: rem(140);
  border-radius: 50%;

  @include from-desktop {
    width: rem(152);
    height: rem(163);
  }
}

.logoImage {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.logoImageWide {
  width: 160.86%;
  max-width: none;
  margin-left: -38.11%;
}

.logoImageEkonika {
  width: 180.74%;
  max-width: none;
  margin-left: -80.05%;
}

.name {
  @include fs-h2;
  color: var(--fs-color-black);
  white-space: nowrap;

  /* Figma brand: Tab 30; Desk — токен H2. */
  @include from-tablet {
    font-size: rem(30);
  }

  @include from-desktop {
    font-size: var(--fs-text-h2-size);
  }
}

@keyframes home-brands-marquee-rtl {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes home-brands-marquee-ltr {
  from {
    transform: translateX(-50%);
  }

  to {
    transform: translateX(0);
  }
}
</style>
