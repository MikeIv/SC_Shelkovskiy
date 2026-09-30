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
    <img
      :class="$style.watermark"
      :src="tenantsStats.watermarkSrc"
      alt=""
      width="1348"
      height="1344"
      aria-hidden="true"
      decoding="async"
    >

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
  // Figma 580:33719 — центр 1920, top 488, 1348×1344.
  top: rem(280);
  left: 50%;
  width: min(140%, rem(720));
  height: auto;
  pointer-events: none;
  transform: translateX(-50%);

  @include from-desktop {
    top: rem(488);
    width: rem(1348);
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
