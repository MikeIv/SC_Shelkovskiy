<script setup lang="ts">
import type { DirectionsPlace } from '#shared/types/directions'

defineProps<{
  place: DirectionsPlace
  mapAlt: string
  routeHref: string
  routePhrase: string
}>()
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.mapWrap">
      <UiYandexMapFrame
        :place="place"
        :map-alt="mapAlt"
      />
    </div>

    <a
      :class="$style.routeLink"
      :href="routeHref"
      target="_blank"
      rel="noopener noreferrer"
    >
      Построить маршрут {{ routePhrase }} в Яндекс&nbsp;Картах
    </a>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;

  @include from-desktop {
    gap: var(--fs-space-2);
  }
}

.mapWrap {
  position: relative;
  height: rem(500);
  border-radius: rem(32);
  overflow: clip;

  @include from-desktop {
    height: rem(600);
    border-radius: rem(60);
  }
}

.routeLink {
  display: none;
  @include fs-text-lg;
  align-self: flex-start;
  color: var(--fs-color-black);
  text-decoration: underline;
  text-underline-offset: rem(3);

  @include from-desktop {
    display: inline;
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}
</style>
