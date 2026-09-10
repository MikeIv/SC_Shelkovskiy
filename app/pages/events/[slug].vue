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
  <div :class="$style.root">
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

        <EventsDetailArticle :item="item" />
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
