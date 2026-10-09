<script setup lang="ts">
const { label } = getSiteNavItem('/events')

const breadcrumbItems = computed(() => [{ label: 'Главная', to: '/' }, { label }])

const { items } = await useEvents()
</script>

<template>
  <LayoutInnerPage :title="label">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <EventsList :items="items" />
  </LayoutInnerPage>
</template>
