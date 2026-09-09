<script setup lang="ts">
import { awardsItems, awardsPageTitle } from '~/data/awardsPage'

const pageTitle = awardsPageTitle

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]

useSeoMeta({
  title: pageTitle,
})
</script>

<template>
  <div :class="$style.root">
    <LayoutInnerPage :title="pageTitle">
      <template #lead>
        <UiBreadcrumbs :items="breadcrumbItems" />
      </template>

      <AwardsGrid :items="awardsItems" />
    </LayoutInnerPage>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  min-width: 0;
}
</style>
