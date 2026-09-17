<script setup lang="ts">
import type { HomeBrandRow } from '#shared/types/home'

const { rows } = defineProps<{
  rows: HomeBrandRow[]
}>()

const paused = ref(false)

function togglePause() {
  paused.value = !paused.value
}
</script>

<template>
  <section :class="$style.root" aria-label="Бренды торгового центра">
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
                :src="item.imageSrc"
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
  padding-block: var(--home-stack-pad, var(--fs-space-6))
    var(--home-stack-pad, #{rem(100)});
  overflow: hidden;

  @include from-desktop {
    gap: var(--fs-space-3);
    padding-block: var(--home-stack-pad, var(--fs-space-6))
      var(--home-stack-pad, #{rem(140)});
  }
}

.pause {
  position: absolute;
  z-index: z('default');
  top: var(--fs-space-3);
  right: var(--fs-space-3);
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
  color: var(--fs-color-black);
  background-color: var(--fs-color-white);
  appearance: none;

  &:focus-visible {
    width: auto;
    height: auto;
    padding: rem(6) rem(12);
    overflow: visible;
    clip-path: none;
    border: rem(1) solid var(--fs-color-gray);
    border-radius: var(--fs-radius-sm);
    @include fs-text-sm;
    cursor: pointer;
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
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
