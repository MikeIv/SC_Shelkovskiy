<script setup lang="ts">
import { eventsAfishaItems } from '~/data/eventsItems'

const { label } = getSiteNavItem('/events')

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label },
])
</script>

<template>
  <LayoutInnerPage :title="label">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <EventsList :items="eventsAfishaItems" />
  </LayoutInnerPage>
</template>
