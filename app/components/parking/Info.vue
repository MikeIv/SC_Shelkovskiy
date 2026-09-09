<script setup lang="ts">
import type { ParkingFloor, ParkingTariff } from '#shared/types/parking'

const {
  title,
  description,
  notes,
  rulesLabel,
  rulesHref,
  imageSrc,
  imageAlt,
  mapSrc,
  mapAlt,
  tariffs,
  floors,
} = defineProps<{
  title: string
  description: string
  notes: string
  rulesLabel: string
  rulesHref: string
  imageSrc: string
  imageAlt: string
  mapSrc: string
  mapAlt: string
  tariffs: ParkingTariff[]
  floors: ParkingFloor[]
}>()

const activeFloorId = ref(floors.at(-1)?.id ?? floors[0]?.id ?? '')
</script>

<template>
  <section :class="$style.root" aria-labelledby="parking-info-title">
    <div :class="$style.top">
      <div :class="$style.copy">
        <h1 id="parking-info-title" :class="$style.title">{{ title }}</h1>
        <p :class="$style.desc">{{ description }}</p>

        <ul :class="$style.tariffs">
          <li
            v-for="tariff in tariffs"
            :key="tariff.id"
            :class="$style.tariff"
          >
            <p :class="$style.tariffLabel">{{ tariff.label }}</p>
            <p :class="$style.tariffPrice">{{ tariff.price }}</p>
          </li>
        </ul>

        <p :class="$style.notes">{{ notes }}</p>

        <a
          :class="$style.rules"
          :href="rulesHref"
        >
          <UIcon
            name="local:file-dock"
            :class="$style.rulesIcon"
            aria-hidden="true"
          />
          <span>{{ rulesLabel }}</span>
        </a>
      </div>

      <div :class="$style.media">
        <img
          :class="$style.image"
          :src="imageSrc"
          :alt="imageAlt"
          width="636"
          height="500"
          decoding="async"
        >
      </div>
    </div>

    <div :class="$style.mapWrap">
      <img
        :class="$style.map"
        :src="mapSrc"
        :alt="mapAlt"
        width="1560"
        height="600"
        loading="lazy"
        decoding="async"
      >

      <div
        :class="$style.floors"
        role="group"
        aria-label="Этажи парковки"
      >
        <button
          v-for="floor in floors"
          :key="floor.id"
          type="button"
          :class="$style.floor"
          :aria-pressed="activeFloorId === floor.id"
          :data-active="activeFloorId === floor.id ? 'true' : undefined"
          @click="activeFloorId = floor.id"
        >
          {{ floor.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include from-desktop {
    gap: rem(24);
  }
}

.top {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);

  @include from-desktop {
    flex-direction: row;
    gap: rem(80);
    align-items: flex-start;
    justify-content: space-between;
  }

  @include from-wide {
    gap: rem(156);
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    flex: 1 1 rem(560);
    max-width: rem(768);
    gap: rem(48);
  }
}

.title {
  @include fs-h1;
  margin: 0;
}

.desc {
  margin: 0;
  @include fs-text-lg;
  overflow-wrap: break-word;
}

.tariffs {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-tablet {
    flex-direction: row;
    gap: var(--fs-space-3);
  }
}

.tariff {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--fs-space-2);
  justify-content: center;
  min-width: 0;
  padding: var(--fs-space-3);
  background-color: var(--fs-color-light);
  border-radius: rem(24);

  @include from-desktop {
    gap: var(--fs-space-3);
    padding: var(--fs-space-3);
    border-radius: rem(32);
  }
}

.tariffLabel {
  margin: 0;
  @include fs-h4;
  font-weight: 400;
}

.tariffPrice {
  margin: 0;
  @include fs-h2;
}

.notes {
  margin: 0;
  @include fs-text-lg;
  white-space: pre-line;
  overflow-wrap: break-word;

  @include from-desktop {
    max-width: rem(653);
  }
}

.rules {
  display: inline-flex;
  gap: var(--fs-space-2);
  align-items: center;
  align-self: flex-start;
  padding: var(--fs-space-2) var(--fs-space-3);
  @include fs-h4;
  color: var(--fs-color-black);
  text-decoration: none;
  background-color: var(--fs-color-light);
  border-radius: rem(32);
  transition: background-color 0.2s ease;

  @media (hover: hover) {
    &:hover {
      background-color: var(--fs-color-light-hover);
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.rulesIcon {
  flex-shrink: 0;
  width: rem(32);
  height: rem(32);
}

.media {
  flex-shrink: 0;
  width: 100%;
  overflow: clip;
  border-radius: rem(32);
  aspect-ratio: 636 / 500;

  @include from-desktop {
    flex: 0 1 rem(520);
    max-width: rem(636);
    border-radius: rem(60);
  }
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mapWrap {
  position: relative;
  width: 100%;
  overflow: clip;
  background-color: var(--fs-color-white);
  border-radius: rem(32);
  aspect-ratio: 1560 / 600;

  @include from-desktop {
    border-radius: rem(60);
  }
}

.map {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.floors {
  position: absolute;
  top: 50%;
  right: var(--fs-space-2);
  display: flex;
  flex-direction: column;
  gap: rem(4);
  transform: translateY(-50%);

  @include from-desktop {
    right: rem(16);
  }
}

.floor {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: rem(2) solid var(--fs-color-white);
  border-radius: 50%;
  @include fs-text-md;
  color: var(--fs-color-black);
  background-color: var(--fs-color-light);
  cursor: pointer;
  appearance: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  @include from-desktop {
    width: rem(58);
    height: rem(58);
  }

  &[data-active='true'] {
    color: var(--fs-color-white);
    background-color: var(--fs-color-black);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
</style>
