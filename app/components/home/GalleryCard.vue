<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(
  defineProps<{
    id: string
    title: string
    date: string
    imageSrc: string
    imageAlt: string
    photoCount: number
    to?: string
  }>(),
  {
    to: '/gallery',
  },
)

const rootTag = computed(() => (props.to ? NuxtLink : 'article'))
const rootBind = computed(() => (props.to ? { to: props.to } : {}))
</script>

<template>
  <component :is="rootTag" :id="id" :class="$style.root" v-bind="rootBind">
    <div :class="$style.media">
      <img
        :class="$style.image"
        :src="imageSrc"
        :alt="imageAlt"
        width="768"
        height="500"
        loading="lazy"
        decoding="async"
      >

      <UiTag :class="$style.photoTag" variant="other">
        {{ photoCount }} фото
      </UiTag>
    </div>

    <div :class="$style.copy">
      <p :class="$style.date">{{ date }}</p>
      <h3 :class="$style.title">{{ title }}</h3>
    </div>
  </component>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  overflow: clip;
  color: inherit;
  text-decoration: none;
}

.media {
  position: relative;
  width: 100%;
  aspect-ratio: 768 / 500;
  overflow: clip;
  border-radius: rem(24);

  @include from-desktop {
    border-radius: rem(32);
  }
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photoTag {
  position: absolute;
  top: var(--fs-space-2);
  left: var(--fs-space-2);
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
}

.date {
  margin: 0;
  @include fs-text-md;
  color: var(--fs-color-gray);
}

.title {
  margin: 0;
  @include fs-h4;
  color: var(--fs-color-black);
}
</style>
