<script setup lang="ts">
import type { HomeShopCategory } from '#shared/types/home'

const { items } = defineProps<{
  items: HomeShopCategory[]
}>()
</script>

<template>
  <section :class="$style.root" aria-label="Категории магазина">
    <div :class="$style.inner">
      <HomeShopCategory :items="items" />
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  width: 100%;
  overflow-x: clip;
}

.inner {
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;

  @include from-desktop {
    padding-inline: var(--fs-grid-margin);
  }
}
</style>
