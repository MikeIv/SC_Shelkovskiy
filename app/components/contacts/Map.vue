<script setup lang="ts">
import type { DirectionsPlace } from '#shared/types/directions'

const props = defineProps<{
  place: DirectionsPlace
  mapAlt: string
}>()

const config = useRuntimeConfig()

const hasApiKey = computed(() => Boolean(config.public.yandexMaps?.apikey?.trim()))

const iframeSrc = computed(() => {
  const [lng, lat] = props.place.coordinates
  return `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=15&pt=${lng},${lat},pm2rdm&l=map`
})
</script>

<template>
  <ClientOnly>
    <LazyDirectionsYandexMap
      v-if="hasApiKey"
      :class="$style.map"
      :place="place"
    />

    <iframe
      v-else
      :class="$style.map"
      :src="iframeSrc"
      :title="mapAlt"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    />

    <template #fallback>
      <div
        :class="$style.map"
        role="img"
        :aria-label="mapAlt"
      />
    </template>
  </ClientOnly>
</template>

<style module lang="scss">
.map {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background-color: var(--fs-color-light);
}
</style>
