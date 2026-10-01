<script setup lang="ts">
import {
  parkingBenefitGroups,
  parkingFloors,
  parkingInfo,
  parkingPasses,
  parkingPassSection,
  parkingSpecial,
  parkingTariffs,
} from '~/data/parkingPage'

definePageMeta({
  patternSide: 'right',
})

const pageTitle = parkingInfo.title

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]

useSeoMeta({
  title: pageTitle,
})
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.lead">
      <UiBreadcrumbs :items="breadcrumbItems" />
    </div>

    <div :class="$style.sections">
      <ParkingInfo
        v-bind="parkingInfo"
        :tariffs="parkingTariffs"
        :floors="parkingFloors"
      />

      <ParkingPass
        v-bind="parkingPassSection"
        :items="parkingPasses"
      />

      <ParkingSpecial
        benefits-title="Льготы"
        :benefit-groups="parkingBenefitGroups"
        :special="parkingSpecial"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.page {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  padding-top: var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    padding-top: var(--fs-space-6);
  }
}

.lead {
  min-width: 0;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-section);
  min-width: 0;
}
</style>
