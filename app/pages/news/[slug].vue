<script setup lang="ts">
import { newsRelatedKind } from '#shared/utils/newsTag'

const route = useRoute()
const { label: newsListLabel } = getSiteNavItem('/news')

const slug = String(route.params.slug ?? '')
const { item, related } = await useFeedItem(slug)

if (!item.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

const relatedKind = computed(() => newsRelatedKind(item.value?.tagVariant))

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: newsListLabel, to: '/news' },
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

    <NewsDetailArticle :item="item" />

    <NewsRelated
      v-if="related.length"
      :items="related"
      :kind="relatedKind"
    />
  </LayoutInnerPage>
</template>
