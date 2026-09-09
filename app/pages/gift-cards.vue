<script setup lang="ts">
import {
  giftCardsFaq,
  giftCardsFaqItems,
  giftCardsFeatureItems,
  giftCardsFeatures,
  giftCardsHero,
  giftCardsHow,
  giftCardsHowSteps,
} from '~/data/giftCardsPage'

const pageTitle = giftCardsHero.title

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]

useSeoMeta({
  title: pageTitle,
})
</script>

<template>
  <div :class="$style.root">
    <GiftCardsHero
      v-bind="giftCardsHero"
      :breadcrumbs="breadcrumbItems"
    />

    <div :class="$style.page">
      <GiftCardsFeatures
        v-bind="giftCardsFeatures"
        :items="giftCardsFeatureItems"
      />
    </div>

    <GiftCardsHow
      v-bind="giftCardsHow"
      :steps="giftCardsHowSteps"
    />

    <div :class="$style.page">
      <GiftCardsFaq
        v-bind="giftCardsFaq"
        :items="giftCardsFaqItems"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  padding-bottom: var(--fs-space-5);

  @include from-desktop {
    gap: rem(160);
    padding-bottom: rem(160);
  }
}

.page {
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );
}
</style>
