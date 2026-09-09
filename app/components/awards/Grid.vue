<script setup lang="ts">
import type { AwardsItem } from '#shared/types/awards'

defineProps<{
  items: readonly AwardsItem[]
}>()
</script>

<template>
  <div :class="$style.root">
    <ul
      v-if="items.length"
      :class="$style.list"
      aria-label="Социальная активность и награды"
    >
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <AwardsCard :item="item" />
      </li>
    </ul>

    <p
      v-else
      :class="$style.empty"
    >
      Пока нет материалов
    </p>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  width: 100%;
}

.list {
  display: grid;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.item {
  display: flex;
  min-width: 0;
}

.empty {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}
</style>
