<script setup lang="ts">
import type { MapPlace } from '#shared/types/map'

defineProps<{
  /** Живая точка из блока `map_route`; без неё показывается статичная карта. */
  place: MapPlace | null
  mapAlt: string
  mapSrc: string
}>()
</script>

<template>
  <UiYandexMapFrame
    v-if="place"
    :place="place"
    :map-alt="mapAlt"
    :fallback-src="mapSrc"
  />

  <img
    v-else
    :class="$style.map"
    :src="mapSrc"
    :alt="mapAlt"
    width="634"
    height="443"
    decoding="async"
  >
</template>

<style module lang="scss">
.map {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
