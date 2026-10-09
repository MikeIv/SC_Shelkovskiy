<script setup lang="ts">
import { isTenantCatalog, tenantCatalogPath } from '#shared/utils/tenantPath'
import type { TenantDetail } from '#shared/types/tenantDetail'

const route = useRoute()
const catalogParam = String(route.params.catalog ?? '')
const slug = String(route.params.slug ?? '')

if (!isTenantCatalog(catalogParam)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

const catalog = catalogParam
const { label: catalogLabel } = getSiteNavItem(tenantCatalogPath(catalog))
const item = ref<TenantDetail | null>(null)

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: catalogLabel, to: tenantCatalogPath(catalog) },
  { label: item.value?.title ?? '' },
])

useSeoMeta({
  title: () => item.value?.seo?.title || item.value?.title,
  description: () => item.value?.seo?.description || undefined,
  ogImage: () => item.value?.seo?.ogImage || undefined,
})

const loaded = await useTenant(catalog, slug)
item.value = loaded.item.value

if (!item.value || item.value.catalog !== catalog) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}
</script>

<template>
  <LayoutInnerPage v-if="item">
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <TenantArticle :item="item" />

    <TenantNews
      v-if="item.news.length"
      :items="item.news"
    />
  </LayoutInnerPage>
</template>
