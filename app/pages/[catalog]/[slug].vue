<script setup lang="ts">
import { getTenantDetailBySlug } from '~/data/tenantDetails'
import { isTenantCatalog, tenantCatalogPath } from '#shared/utils/tenantPath'

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
const item = getTenantDetailBySlug(catalog, slug)

if (!item) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

const { label: catalogLabel } = getSiteNavItem(tenantCatalogPath(catalog))

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: catalogLabel, to: tenantCatalogPath(catalog) },
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

    <TenantArticle :item="item" />

    <TenantNews
      v-if="item.news.length"
      :items="item.news"
    />
  </LayoutInnerPage>
</template>
