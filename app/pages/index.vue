<script setup lang="ts">
import { homeIntroSlides } from '~/data/homeIntroSlides'
import { homeNewsItems } from '~/data/homeNewsItems'

definePageMeta({
  headerOverlay: true,
})

useSeoMeta({
  title: 'ТРЦ «Щёлковский»',
})
</script>

<template>
  <div>
    <HomeIntro :slides="homeIntroSlides" />
    <HomeNews :items="homeNewsItems" />
  </div>
</template>
