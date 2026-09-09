<script setup lang="ts">
import {
  loyaltyBenefitItems,
  loyaltyBenefits,
  loyaltyCta,
  loyaltyHero,
  loyaltyJoin,
  loyaltyJoinSteps,
  loyaltyLevelItems,
  loyaltyLevels,
  loyaltyPointSteps,
  loyaltyPoints,
  loyaltyStoreLinks,
} from '~/data/loyaltyPage'

const pageTitle = 'Программа лояльности'

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
    <LoyaltyHero
      v-bind="loyaltyHero"
      :store-links="loyaltyStoreLinks"
      :breadcrumbs="breadcrumbItems"
    />

    <div :class="[$style.page, $style.stack]">
      <LoyaltyBenefits
        v-bind="loyaltyBenefits"
        :items="loyaltyBenefitItems"
      />
      <LoyaltyJoin
        v-bind="loyaltyJoin"
        :steps="loyaltyJoinSteps"
        :store-links="loyaltyStoreLinks"
      />
    </div>

    <LoyaltyPoints
      v-bind="loyaltyPoints"
      :steps="loyaltyPointSteps"
    />

    <div :class="[$style.page, $style.stack]">
      <LoyaltyLevels
        v-bind="loyaltyLevels"
        :items="loyaltyLevelItems"
      />
      <LoyaltyCta
        v-bind="loyaltyCta"
        :store-links="loyaltyStoreLinks"
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

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  min-width: 0;

  @include from-desktop {
    gap: rem(160);
  }
}
</style>
