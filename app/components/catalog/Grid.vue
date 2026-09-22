<script setup lang="ts">
import type { CatalogCardItem, CatalogCardLayout } from '#shared/types/catalog'

defineProps<{
  items: CatalogCardItem[]
  layout: CatalogCardLayout
}>()
</script>

<template>
  <p v-if="!items.length" :class="$style.empty" role="status">
    По вашему запросу ничего не найдено
  </p>

  <CatalogList v-else-if="layout === 'list'" :items="items" />

  <div v-else :class="$style.root">
    <ul :class="[$style.list, $style.gridMode]">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <CatalogCard v-bind="item" layout="card" />
      </li>
    </ul>
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
    gap: var(--fs-space-3) var(--fs-space-2);
  }

  @include from-desktop {
    gap: var(--fs-space-5) var(--fs-space-3);
  }
}

.gridMode {
  grid-template-columns: minmax(0, 1fr);

  @include from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include from-desktop {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.item {
  display: flex;
  min-width: 0;
}

.empty {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
}
</style>
