<script setup lang="ts">
import { getNewsDetailBySlug, getNewsRelatedKind, getRelatedNewsItems } from '~/data/newsDetails'

const route = useRoute()
const { label: newsListLabel } = getSiteNavItem('/news')

const slug = String(route.params.slug ?? '')
const item = getNewsDetailBySlug(slug)

if (!item) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

const relatedItems = getRelatedNewsItems(slug)
const relatedKind = getNewsRelatedKind(item.tagVariant)

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: newsListLabel, to: '/news' },
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

    <NewsDetailArticle :item="item" />

    <NewsRelated
      v-if="relatedItems.length"
      :items="relatedItems"
      :kind="relatedKind"
    />
  </LayoutInnerPage>
</template>
