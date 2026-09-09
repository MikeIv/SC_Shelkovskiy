<script setup lang="ts">
import { awardsPageTitle, getAwardsDetailBySlug, getRelatedAwardsItems } from '~/data/awardsPage'

const route = useRoute()

const slug = computed(() => String(route.params.slug ?? ''))
const item = computed(() => getAwardsDetailBySlug(slug.value))
const relatedItems = computed(() => (item.value ? getRelatedAwardsItems(item.value.id) : []))

watch(
  item,
  (value) => {
    if (!value) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Страница не найдена',
      })
    }
  },
  { immediate: true },
)

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: awardsPageTitle, to: '/awards' },
  { label: item.value?.title ?? '' },
])

useSeoMeta({
  title: () => item.value?.title ?? '',
})
</script>

<template>
  <div
    v-if="item"
    :class="$style.root"
  >
    <img
      :class="$style.watermark"
      src="/images/about/watermark.svg"
      alt=""
      width="1348"
      height="1344"
      aria-hidden="true"
      decoding="async"
    >

    <div :class="$style.page">
      <LayoutInnerPage>
        <template #lead>
          <UiBreadcrumbs :items="breadcrumbItems" />
        </template>

        <AwardsDetailArticle :item="item" />

        <AwardsRelated
          v-if="relatedItems.length"
          :items="relatedItems"
        />
      </LayoutInnerPage>
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  overflow: clip;
}

.watermark {
  position: absolute;
  top: rem(-40);
  right: rem(-180);
  width: min(100%, rem(640));
  height: auto;
  pointer-events: none;
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
