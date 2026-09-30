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
      :class="$style.pattern"
      src="/images/awards/detail-pattern.svg"
      alt=""
      width="1001"
      height="999"
      aria-hidden="true"
      decoding="async"
    >

    <div :class="$style.page">
      <LayoutInnerPage>
        <template #lead>
          <UiBreadcrumbs :items="breadcrumbItems" />
        </template>

        <div :class="$style.sections">
          <AwardsDetailArticle :item="item" />

          <AwardsRelated
            v-if="relatedItems.length"
            :items="relatedItems"
          />
        </div>
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

.pattern {
  position: absolute;
  top: 0;
  right: rem(-160);
  width: min(80%, rem(640));
  height: auto;
  max-width: none;
  pointer-events: none;

  @include from-desktop {
    /* 29px от верха кадра минус высота header (151px). */
    top: calc(#{rem(29)} - #{rem(151)});
    right: auto;
    left: calc(75% - #{rem(25)});
    width: rem(1001);
  }
}

.sections {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-section);

  @include from-desktop {
    /* Gap InnerPage 40px, в кадре до даты 56px. */
    margin-top: calc(#{rem(56)} - var(--fs-space-5));
  }
}

.page {
  position: relative;
  z-index: z('default');
}
</style>
