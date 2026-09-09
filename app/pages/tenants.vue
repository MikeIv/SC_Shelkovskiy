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
    <TenantsHero
      v-bind="tenantsHero"
      :breadcrumbs="breadcrumbItems"
    />

    <div :class="$style.stack">
      <div :class="$style.ornamentBlock">
        <img
          :class="$style.watermark"
          :src="tenantsStats.watermarkSrc"
          alt=""
          width="1348"
          height="1344"
          aria-hidden="true"
          decoding="async"
        >

        <div :class="$style.page">
          <TenantsStats
            :title="tenantsStats.title"
            :description="tenantsStats.description"
            :items="tenantsStatItems"
          />
        </div>
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
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  padding-bottom: var(--fs-space-5);

  @include from-desktop {
    gap: rem(160);
    padding-bottom: rem(160);
  }
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);

  @include from-desktop {
    gap: rem(160);
  }
}

.page {
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );
}

.ornamentBlock {
  position: relative;
  overflow: clip;
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(100%, rem(900));
  height: auto;
  pointer-events: none;
  opacity: 0.12;
  transform: translate(-50%, -45%);

  @include from-desktop {
    width: rem(1348);
  }
}
</style>
