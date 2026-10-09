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

const layout = useLayoutStore()

const storeLinks = computed(() =>
  loyaltyStoreLinks.flatMap((link) => {
    const fromApi = layout.apps.find((app) => app.id === link.id)
    if (!fromApi) return []

    return [{ ...link, href: fromApi.href, label: fromApi.label }]
  }),
)

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
      :store-links="storeLinks"
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
        :store-links="storeLinks"
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
        :store-links="storeLinks"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-section);
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
  gap: var(--fs-space-section);
  min-width: 0;
}
</style>
