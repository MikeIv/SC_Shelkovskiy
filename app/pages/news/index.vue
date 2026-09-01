<script setup lang="ts">
import { newsCatalogItems } from '~/data/newsCatalogItems'

const { label } = getSiteNavItem('/news')

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label },
])

const { tab, filteredItems } = useNewsFilters(newsCatalogItems)
</script>

<template>
  <LayoutInnerPage :title="label">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <NewsFilters v-model:tab="tab" />

    <NewsGrid :items="filteredItems" />
  </LayoutInnerPage>
</template>
