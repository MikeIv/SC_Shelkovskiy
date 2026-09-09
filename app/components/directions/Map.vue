<script setup lang="ts">
import type { DirectionsPlace } from '#shared/types/directions'

const props = defineProps<{
  place: DirectionsPlace
  mapAlt: string
  routeHref: string
  routePhrase: string
}>()

const config = useRuntimeConfig()

const hasApiKey = computed(() =>
  Boolean(config.public.yandexMaps?.apikey?.trim()),
)

const iframeSrc = computed(() => {
  const [lng, lat] = props.place.coordinates
  return `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=15&pt=${lng},${lat},pm2rdm&l=map`
})
</script>

<template>
  <div :class="$style.root">
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
  gap: var(--fs-space-2);
  min-width: 0;
}

.map {
  display: block;
  width: 100%;
  height: rem(280);
  overflow: clip;
  border: 0;
  border-radius: rem(24);
  background-color: var(--fs-color-light);

  @include from-tablet {
    height: rem(420);
    border-radius: rem(40);
  }

  @include from-desktop {
    height: rem(600);
    border-radius: rem(60);
  }
}

.routeLink {
  @include fs-text-lg;
  align-self: flex-start;
  color: var(--fs-color-black);
  text-decoration: underline;
  text-underline-offset: rem(3);

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}
</style>
