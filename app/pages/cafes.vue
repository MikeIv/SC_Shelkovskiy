<script setup lang="ts">
import { cafesCatalogItems } from '~/data/cafesCatalogItems'

const { label } = getSiteNavItem('/cafes')

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
  breakfastOnly,
  businessLunchOnly,
  viewMode,
  categoryOptions,
  floorOptions,
  searchOptions,
  filteredItems,
} = useCatalogFilters(cafesCatalogItems, {
  categoryPlaceholder: 'Тип кухни',
  withCafeFilters: true,
})
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
      v-model:breakfast-only="breakfastOnly"
      v-model:business-lunch-only="businessLunchOnly"
      v-model:view-mode="viewMode"
      variant="cafes"
      :category-options="categoryOptions"
      :floor-options="floorOptions"
      :search-options="searchOptions"
    />

    <CatalogGrid :items="filteredItems" :layout="viewMode" />
  </LayoutInnerPage>
</template>
