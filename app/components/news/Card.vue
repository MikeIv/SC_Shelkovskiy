<script setup lang="ts">
import type { NewsCardItem, NewsCardLayout } from '#shared/types/news'
import { getNewsDetailPath } from '#shared/utils/newsPath'

const props = withDefaults(
  defineProps<{
    item: NewsCardItem
    layout?: NewsCardLayout
  }>(),
  {
    layout: 'catalog',
  },
)

const linkTarget = computed(() => props.item.to ?? getNewsDetailPath(props.item.id))
</script>

<template>
  <NuxtLink
    :to="linkTarget"
    :class="$style.root"
    :data-layout="layout"
  >
    <div :class="$style.media">
      <img
        v-if="item.imageSrc"
        :class="$style.image"
        :src="item.imageSrc"
        :alt="item.imageAlt || item.title"
        loading="lazy"
        decoding="async"
      >
      <div v-else :class="$style.imagePlaceholder" aria-hidden="true">
        <UiLogo :class="$style.imageFallback" />
      </div>
    </div>

    <div :class="$style.body">
      <div :class="$style.meta">
        <UiTag :variant="item.tagVariant">{{ item.tagLabel }}</UiTag>
        <span :class="$style.date">{{ item.date }}</span>
      </div>

      <div :class="$style.copy">
        <p :class="$style.category">{{ item.category }}</p>
        <h3 :class="$style.title">{{ item.title }}</h3>
      </div>
    </div>
  </NuxtLink>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: clip;
  color: inherit;
  text-decoration: none;
}

.media {
  flex-shrink: 0;
  width: 100%;
  height: rem(240);
  overflow: clip;
  border-radius: rem(24);
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.imagePlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--fs-color-light);
}

.imageFallback {
  width: rem(120);
  opacity: 0.25;

  @include from-desktop {
    width: rem(160);
  }
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  padding-top: var(--fs-space-2);
}

.meta {
  display: flex;
  gap: var(--fs-space-2);
  align-items: center;
  justify-content: space-between;
}

.date {
  flex-shrink: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  white-space: nowrap;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  min-width: 0;
}

.category {
  margin: 0;
  @include fs-text-md;
  color: var(--fs-color-gray);
  text-transform: uppercase;
}

.title {
  margin: 0;
  @include fs-h4;
  @include fs-line-clamp(3);
  color: var(--fs-color-black);
}

@include from-desktop {
  .media {
    height: rem(380);
    border-radius: rem(32);
  }

  .copy {
    gap: var(--fs-space-1);
  }

  @media (hover: hover) {
    .root[data-layout='slider'] .image {
      transition: transform 0.45s ease;
    }

    .root[data-layout='slider']:hover .image {
      transform: scale(1.14);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .root[data-layout='slider'] .image {
    transition: none;
    transform: none;
  }
}
</style>
