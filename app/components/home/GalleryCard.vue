<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  id: string
  title: string
  date: string
  imageSrc: string
  imageAlt: string
  photoCount: number
  /** Принимаем из альбома, чтобы не утекало в DOM через attrs. */
  photos?: string[]
  to?: string
}>()

const emit = defineEmits<{
  select: []
}>()

const rootTag = computed(() => (props.to ? NuxtLink : 'div'))
const rootBind = computed(() =>
  props.to
    ? { to: props.to }
    : { role: 'button' as const, tabindex: 0 },
)

function onActivate(): void {
  if (!props.to) {
    emit('select')
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (props.to) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select')
  }
}
</script>

<template>
  <component
    :is="rootTag"
    :id="id"
    :class="$style.root"
    v-bind="rootBind"
    @click="onActivate"
    @keydown="onKeydown"
  >
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
  margin: 0;
  padding: 0;
  overflow: clip;
  border: 0;
  color: inherit;
  text-align: left;
  text-decoration: none;
  background-color: transparent;
  cursor: pointer;
  appearance: none;
  font: inherit;
}

.media {
  position: relative;
  width: 100%;
  aspect-ratio: 343 / 240;
  overflow: clip;
  border-radius: var(--fs-radius-2xl);

  @include from-desktop {
    aspect-ratio: 768 / 500;
    border-radius: var(--fs-radius-3xl);
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
