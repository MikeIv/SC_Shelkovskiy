<script setup lang="ts">
const pageTitle = 'Социальная ответственность'

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]
</script>

<template>
  <LayoutInnerPage :title="pageTitle">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>
  </LayoutInnerPage>
</template>
