<script setup lang="ts">
import type { NewsCardItem } from '#shared/types/news'

defineProps<{
  items: NewsCardItem[]
}>()
</script>

<template>
  <div :class="$style.root">
    <ul v-if="items.length" :class="$style.list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <NewsCard layout="catalog" :item="item" />
      </li>
    </ul>

    <p v-else :class="$style.empty">
      По вашему запросу ничего не найдено
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
    gap: var(--fs-space-3) var(--fs-space-2);
  }

  @include from-desktop {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--fs-space-5) var(--fs-space-3);
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
