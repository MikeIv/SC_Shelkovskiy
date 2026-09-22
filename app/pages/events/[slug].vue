<script setup lang="ts">
import { getEventDetailBySlug } from '~/data/eventsDetails'

const route = useRoute()
const { label: eventsListLabel } = getSiteNavItem('/events')

const slug = String(route.params.slug ?? '')
const item = getEventDetailBySlug(slug)

if (!item) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: eventsListLabel, to: '/events' },
  { label: item.title },
])

useSeoMeta({
  title: item.title,
})
</script>

<template>
  <LayoutInnerPage>
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <EventsDetailArticle :item="item" />
  </LayoutInnerPage>
</template>
