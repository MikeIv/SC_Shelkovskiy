<script setup lang="ts">
const route = useRoute()
const { label: eventsListLabel } = getSiteNavItem('/events')

const slug = String(route.params.slug ?? '')
const { item } = await useEvent(slug)

if (!item.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: eventsListLabel, to: '/events' },
  { label: item.value?.title ?? '' },
])

useSeoMeta({
  title: () => item.value?.seo?.title || item.value?.title,
  description: () => item.value?.seo?.description || undefined,
  ogImage: () => item.value?.seo?.ogImage || undefined,
})
</script>

<template>
  <LayoutInnerPage v-if="item">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <EventsDetailArticle :item="item" />
  </LayoutInnerPage>
</template>
