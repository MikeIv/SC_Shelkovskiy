<script setup lang="ts">
import {
  aboutDesign,
  aboutFeatures,
  aboutFeaturesTitle,
  aboutHero,
  aboutLead,
  aboutStats,
} from '~/data/aboutPage'
import { homeBrandRows } from '~/data/homeBrandItems'
import { homeLoyaltyItems } from '~/data/homeLoyaltyItems'

definePageMeta({
  headerOverlay: true,
})

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: 'О нас' },
]

useSeoMeta({
  title: 'О нас',
})
</script>

<template>
  <div>
    <AboutHero
      v-bind="aboutHero"
      :breadcrumbs="breadcrumbItems"
    />
    <AboutLead v-bind="aboutLead" />
    <div :class="$style.sections">
      <AboutDesign
        v-bind="aboutDesign"
        :stats="aboutStats"
      />
      <AboutFeatures
        v-bind="aboutFeaturesTitle"
        :items="aboutFeatures"
      />
    </div>
    <HomeBrands :rows="homeBrandRows" />
    <HomeLoyalty :items="homeLoyaltyItems" />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.sections {
  display: flex;
  flex-direction: column;
  gap: rem(80);

  @include from-desktop {
    gap: rem(160);
  }
}
</style>
