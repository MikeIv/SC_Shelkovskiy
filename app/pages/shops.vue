<script setup lang="ts">
import { shopsCatalogItems } from '~/data/shopsCatalogItems'

const { label } = getSiteNavItem('/shops')

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
} = useCatalogFilters(shopsCatalogItems)
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
      :category-options="categoryOptions"
      :floor-options="floorOptions"
      :search-options="searchOptions"
    />

    <CatalogGrid :items="filteredItems" :layout="viewMode" />
  </LayoutInnerPage>
</template>
