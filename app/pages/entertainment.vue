<script setup lang="ts">
import { entertainmentCatalogItems } from '~/data/entertainmentCatalogItems'

const { label } = getSiteNavItem('/entertainment')

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label },
])

const {
  query,
  category,
  floor,
  loyaltyOnly,
  actionsOnly,
  viewMode,
  categoryOptions,
  floorOptions,
  searchOptions,
  filteredItems,
} = useCatalogFilters(entertainmentCatalogItems)
</script>

<template>
  <LayoutInnerPage :title="label">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <CatalogFilters
      v-model:query="query"
      v-model:category="category"
      v-model:floor="floor"
      v-model:loyalty-only="loyaltyOnly"
      v-model:actions-only="actionsOnly"
      v-model:view-mode="viewMode"
      variant="entertainment"
      :category-options="categoryOptions"
      :floor-options="floorOptions"
      :search-options="searchOptions"
    />

    <CatalogGrid :items="filteredItems" :layout="viewMode" />
  </LayoutInnerPage>
</template>
