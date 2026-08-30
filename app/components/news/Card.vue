<script setup lang="ts">
import { NuxtLink } from '#components'
import type { UiTagVariant } from '~/components/ui/Tag.vue'
import type { NewsCardLayout } from '#shared/types/news'

const props = withDefaults(
  defineProps<{
    imageSrc: string
    imageAlt: string
    date: string
    category: string
    title: string
    tagLabel?: string
    tagVariant?: UiTagVariant
    to?: string
    layout?: NewsCardLayout
  }>(),
  {
    tagLabel: 'Новость',
    tagVariant: 'news',
    to: undefined,
    layout: 'catalog',
  },
)

const rootTag = computed(() => (props.to ? NuxtLink : 'article'))
const rootBind = computed(() => (props.to ? { to: props.to } : {}))
</script>

<template>
  <component :is="rootTag" :class="$style.root" :data-layout="layout" v-bind="rootBind">
    <div :class="$style.media">
      <img :class="$style.image" :src="imageSrc" :alt="imageAlt" loading="lazy" />
    </div>

    <div :class="$style.body">
      <div :class="$style.meta">
        <UiTag :variant="tagVariant">{{ tagLabel }}</UiTag>
        <span :class="$style.date">{{ date }}</span>
      </div>

      <div :class="$style.copy">
        <p :class="$style.category">{{ category }}</p>
        <h3 :class="$style.title">{{ title }}</h3>
      </div>
    </div>
  </component>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  width: 100%;
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
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
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
