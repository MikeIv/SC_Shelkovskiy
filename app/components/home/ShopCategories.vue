<script setup lang="ts">
import type { HomeShopCategory } from '#shared/types/home'

const { items } = defineProps<{
  items: HomeShopCategory[]
}>()
</script>

<template>
  <section :class="$style.root" aria-label="Категории магазина">
    <HomeShopCategory :items="items" />
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;

  @include from-desktop {
    padding-block: rem(80) rem(140);
    padding-inline: var(--fs-grid-margin);
  }
}
</style>
