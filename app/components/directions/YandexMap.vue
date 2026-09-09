<script setup lang="ts">
import type { DirectionsPlace } from '#shared/types/directions'
import {
  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapGeolocationControl,
  YandexMapRouteControl,
  YandexMapZoomControl,
} from 'vue-yandex-maps'

const props = defineProps<{
  place: DirectionsPlace
}>()

const mapSettings = computed(() => ({
  location: {
    center: props.place.coordinates,
    zoom: 15,
  },
}))

const markerSettings = computed(() => ({
  coordinates: props.place.coordinates,
  title: props.place.title,
  subtitle: props.place.address,
}))
</script>

<template>
  <YandexMap
    :settings="mapSettings"
    width="100%"
    height="100%"
  >
    <YandexMapDefaultSchemeLayer />
    <YandexMapDefaultFeaturesLayer />
    <YandexMapDefaultMarker :settings="markerSettings" />
    <YandexMapControls :settings="{ position: 'right' }">
      <YandexMapZoomControl />
      <YandexMapGeolocationControl />
      <YandexMapRouteControl />
    </YandexMapControls>
  </YandexMap>
</template>
