<script setup lang="ts">
import type { HomeShopCategory } from '#shared/types/home'

const { items, isDemo = false } = defineProps<{
  items: HomeShopCategory[]
  /** Раздел подставлен из мока — ярлык «Демо-данные». */
  isDemo?: boolean
}>()
</script>

<template>
  <section :class="$style.root" aria-label="Категории магазина">
    <UiDemoDataBadge v-if="isDemo" :class="$style.demo" />
    <div :class="$style.inner">
      <HomeShopCategory :items="items" />
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  width: 100%;
  overflow-x: clip;
}

.demo {
  position: absolute;
  z-index: z('default');
  top: 0;
  left: var(--fs-grid-margin);
}

.inner {
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;

  /* Tab+: inset сетки; Mob — edge-to-edge. */
  @include from-tablet {
    padding-inline: var(--fs-grid-margin);
  }
}
</style>
