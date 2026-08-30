<script setup lang="ts">
import { homeIntroSlides } from '~/data/homeIntroSlides'

definePageMeta({
  headerOverlay: true,
})

useSeoMeta({
  title: 'ТРЦ «Щёлковский»',
})
</script>

<template>
  <HomeIntro :slides="homeIntroSlides" />
</template>

<style module lang="scss">
@use 'tools' as *;
</style>
