<script setup lang="ts">
import type { HomeLoyaltyCard } from '#shared/types/home'

const { items, flush = false } = defineProps<{
  items: HomeLoyaltyCard[]
  flush?: boolean
}>()
</script>

<template>
  <section
    :class="[$style.root, flush && $style.flush]"
    aria-label="Программа лояльности и подарочные карты"
  >
    <div :class="$style.inner">
      <ul :class="$style.list">
        <li
          v-for="item in items"
          :key="item.id"
          :class="$style.item"
        >
          <HomeLoyaltyCard v-bind="item" />
        </li>
      </ul>
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

  &.flush {
    padding-block: 0;
  }
}

.inner {
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;
  padding-inline: var(--fs-grid-margin);
}

.list {
  display: grid;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--fs-space-3);
  }
}

.item {
  min-width: 0;
}
</style>
