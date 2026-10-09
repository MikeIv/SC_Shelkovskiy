<script setup lang="ts">
import type { NewsFilterTab } from '#shared/types/news'

const { label } = getSiteNavItem('/news')

const breadcrumbItems = computed(() => [{ label: 'Главная', to: '/' }, { label }])

const tab = ref<NewsFilterTab>('news')
const { items, hasMore, loadingMore, pending, loadMore } = await useFeed(tab)
</script>

<template>
  <LayoutInnerPage :title="label">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <NewsFilters v-model:tab="tab" />

    <NewsGrid :items="items" />

    <div v-if="hasMore" :class="$style.more">
      <UiButton :disabled="loadingMore || pending" @click="loadMore">Показать ещё</UiButton>
    </div>
  </LayoutInnerPage>
</template>

<style module lang="scss">
@use 'tools' as *;

.more {
  display: flex;
  justify-content: center;
  margin-top: var(--fs-space-4);

  @include from-desktop {
    margin-top: var(--fs-space-5);
  }
}
</style>
