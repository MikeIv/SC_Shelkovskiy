<script setup lang="ts">
import { rulesDocuments, rulesPageTitle } from '~/data/rulesPage'

const pageTitle = rulesPageTitle

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

    <RulesList :items="rulesDocuments" />
  </LayoutInnerPage>
</template>
