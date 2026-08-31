<script setup lang="ts">
import { homeBrandRows } from '~/data/homeBrandItems'
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
    <HomeBrands :rows="homeBrandRows" />
  </div>
</template>
