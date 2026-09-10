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
  <div :class="$style.root">
    <div :class="$style.watermarkLayer" aria-hidden="true">
      <img
        :class="$style.watermark"
        src="/images/about/watermark.svg"
        alt=""
        width="1348"
        height="1344"
        decoding="async"
      >
    </div>

    <div :class="$style.page">
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
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
}

.watermarkLayer {
  position: absolute;
  inset: 0;
  overflow: clip;
  pointer-events: none;
}

.watermark {
  position: absolute;
  top: rem(-40);
  right: rem(-180);
  width: min(100%, rem(640));
  height: auto;
  opacity: 0.12;

  @include from-desktop {
    top: rem(29);
    right: rem(-40);
    width: rem(1000);
  }
}

.page {
  position: relative;
  z-index: z('default');
}
</style>
