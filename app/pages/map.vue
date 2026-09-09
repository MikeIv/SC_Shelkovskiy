<script setup lang="ts">
import { schemePage } from '~/data/schemePage'

const pageTitle = schemePage.title

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]

useSeoMeta({
  title: pageTitle,
})
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbItems" />

    <SchemeContent :content="schemePage" />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.page {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  padding-block: var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: var(--fs-space-5);
    padding-block: var(--fs-space-6);
  }
}
</style>
