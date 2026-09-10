<script setup lang="ts">
import type { NewsCardItem } from '#shared/types/news'

defineProps<{
  items: NewsCardItem[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="tenant-news-title">
    <h2 id="tenant-news-title" :class="$style.title">Новости и акции</h2>
    <NewsGrid :items="items" />
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  width: 100%;
}

.title {
  margin: 0;
  @include fs-h1;
  color: var(--fs-color-black);
}
</style>
