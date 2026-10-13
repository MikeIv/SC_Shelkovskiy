<script setup lang="ts">
import {
  tenantsAdvantageItems,
  tenantsAdvantages,
  tenantsApply,
  tenantsHero,
  tenantsStatItems,
  tenantsStats,
  tenantsTradeProfiles,
} from '~/data/tenantsPage'

definePageMeta({
  headerOverlay: true,
})

const pageTitle = 'Арендаторам'

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
    <div
      :class="$style.watermark"
      aria-hidden="true"
    />

    <TenantsHero
      v-bind="tenantsHero"
      :breadcrumbs="breadcrumbItems"
    />

    <div :class="$style.stack">
      <div :class="$style.page">
        <TenantsStats
          :title="tenantsStats.title"
          :description="tenantsStats.description"
          :items="tenantsStatItems"
        />
      </div>

      <div :class="$style.page">
        <TenantsAdvantages
          :title="tenantsAdvantages.title"
          :items="tenantsAdvantageItems"
        />
      </div>

      <div :class="$style.page">
        <TenantsApply
          v-bind="tenantsApply"
          :trade-profiles="tenantsTradeProfiles"
        />
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-section);
  overflow: clip;
}

.watermark {
  position: absolute;
  top: rem(750);
  left: 50%;
  width: min(100%, rem(600));
  height: min(100%, rem(600));
  pointer-events: none;
  background-color: var(--fs-color-ornament);
  mask: url('/images/ornament/pattern.svg') center / contain no-repeat;
  transform: translate(-50%, -10%);

  @include from-tablet {
    top: rem(780);
    width: rem(900);
    height: rem(900);
  }

  @include from-desktop {
    top: rem(488);
    width: rem(1348);
    height: rem(1344);
    transform: translateX(-50%);
  }
}

.stack {
  position: relative;
  z-index: z('default');
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
</style>
