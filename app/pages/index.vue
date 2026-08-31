<script setup lang="ts">
import { homeBrandRows } from '~/data/homeBrandItems'
import { homeCinemaItems } from '~/data/homeCinemaItems'
import { homeGalleryItems } from '~/data/homeGalleryItems'
import { homeIntroSlides } from '~/data/homeIntroSlides'
import { homeLoyaltyItems } from '~/data/homeLoyaltyItems'
import { homeNewsItems } from '~/data/homeNewsItems'
import { homeShopCategories } from '~/data/homeShopCategories'

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
    <HomeLoyalty :items="homeLoyaltyItems" />
    <HomeShopCategories :items="homeShopCategories" />
    <HomeCinema :items="homeCinemaItems" />
    <HomeGallery :items="homeGalleryItems" />
  </div>
</template>
