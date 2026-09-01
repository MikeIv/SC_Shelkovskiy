<script setup lang="ts">
import type { NewsFilterTab } from '#shared/types/news'

const FILTERS: { value: NewsFilterTab; label: string }[] = [
  { value: 'news', label: 'Новости' },
  { value: 'action', label: 'Акции' },
  { value: 'smi', label: 'СМИ о нас' },
]

const tab = defineModel<NewsFilterTab>('tab', { default: 'news' })
</script>

<template>
  <div :class="$style.root" role="tablist" aria-label="Фильтр новостей">
    <UiTab
      v-for="filter in FILTERS"
      :key="filter.value"
      role="tab"
      :selected="tab === filter.value"
      :aria-selected="tab === filter.value"
      @click="tab = filter.value"
    >
      {{ filter.label }}
    </UiTab>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-flow: row wrap;
  gap: 0;
  align-items: center;
}
</style>
