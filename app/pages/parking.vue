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
  <div :class="$style.root">
    <img
      :class="$style.watermark"
      src="/images/about/watermark.svg"
      alt=""
      width="1348"
      height="1344"
      aria-hidden="true"
      decoding="async"
    >

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
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  overflow-x: clip;
}

.watermark {
  position: absolute;
  top: rem(-120);
  right: rem(-180);
  width: min(100%, rem(640));
  height: auto;
  pointer-events: none;
  opacity: 0.12;

  @include from-desktop {
    top: rem(-200);
    right: rem(-40);
    width: rem(980);
  }

  @include from-wide {
    width: rem(1348);
  }
}

.page {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  padding-block: var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: var(--fs-space-5);
    padding-block: var(--fs-space-6);
  }
}

.lead {
  min-width: 0;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-6);
  min-width: 0;

  @include from-desktop {
    gap: rem(160);
  }
}
</style>
