<script setup lang="ts">
import type { EventAfishaItem } from '#shared/types/events'

defineProps<{
  items: EventAfishaItem[]
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
        <EventsAfisha :item="item" />
      </li>
    </ul>

    <p v-else :class="$style.empty">
      Сейчас нет мероприятий
    </p>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  width: 100%;
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    gap: var(--fs-space-5);
  }
}

.item {
  min-width: 0;
}

.empty {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}
</style>
