<script setup lang="ts">
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
  showBreakfast,
  showBusinessLunch,
  categoryOptions,
  floorOptions,
  searchOptions,
  filteredItems,
} = useCatalogFilters('cafes', {
  categoryPlaceholder: 'Тип кухни',
})

await useCatalog('cafes')
</script>

<template>
  <LayoutInnerPage :title="label" with-title-aside>
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
      :show-breakfast="showBreakfast"
      :show-business-lunch="showBusinessLunch"
      :search-options="searchOptions"
    />

    <CatalogGrid :items="filteredItems" :layout="viewMode" />
  </LayoutInnerPage>
</template>
