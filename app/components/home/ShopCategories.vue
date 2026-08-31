<script setup lang="ts">
import type { HomeShopCategory } from '#shared/types/home'

const { items } = defineProps<{
  items: HomeShopCategory[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="home-shop-categories-title">
    <div :class="$style.inner">
      <h2 id="home-shop-categories-title" :class="$style.title">
        Категории магазина
      </h2>

      <HomeShopCategory :items="items" />
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  padding-block: rem(60) rem(100);

  @include from-desktop {
    padding-block: rem(80) rem(140);
  }
}

.inner {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;
  padding-inline: var(--fs-grid-margin);

  @include from-desktop {
    gap: var(--fs-space-5);
  }
}

.title {
  margin: 0;
  @include fs-h1;
  color: var(--fs-color-black);
}
</style>
