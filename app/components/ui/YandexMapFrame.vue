<script setup lang="ts">
import type { MapPlace } from '#shared/types/map'

const props = defineProps<{
  place: MapPlace
  /** Подпись карты: `title` у iframe, `alt` и `aria-label` у заглушки. */
  mapAlt: string
  /** Картинка на время SSR и без JS; без неё карта остаётся пустым блоком. */
  fallbackSrc?: string
}>()

const config = useRuntimeConfig()

/** Без ключа модуль `vue-yandex-maps` не подключён — карту отдаёт виджет в iframe. */
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
      <img
        v-if="fallbackSrc"
        :class="$style.map"
        :src="fallbackSrc"
        :alt="mapAlt"
        decoding="async"
      >
      <div
        v-else
        :class="$style.map"
        role="img"
        :aria-label="mapAlt"
      />
    </template>
  </ClientOnly>
</template>

<style module lang="scss">
.map {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background-color: var(--fs-color-light);
  object-fit: cover;
}
</style>
