<script setup lang="ts">
const { page } = await useRulesPage()

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: page.value.title },
])

useSeoMeta({
  description: () => page.value.seoDescription,
  ogImage: () => page.value.seoOgImage,
})
</script>

<template>
  <LayoutInnerPage :title="page.title">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <RulesList :items="page.documents" />
  </LayoutInnerPage>
</template>
