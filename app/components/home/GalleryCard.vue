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
  /** Альбом только с видео: фото нет, просмотрщик открывать нечем. */
  hasVideo?: boolean
  to?: string
}>()

const emit = defineEmits<{
  select: []
}>()

const titleId = useId()
const isLink = computed(() => Boolean(props.to))
const mediaSrc = useMediaSrc()
const coverSrc = computed(() => mediaSrc(props.imageSrc, 1536))

/** Ссылка из CMS ведёт на страницу альбома; без неё открывать нечего, если в альбоме нет фото. */
const isInteractive = computed(() => isLink.value || props.photoCount > 0)

/** Бейдж показывает то, что реально откроется: число фото или метку видео-альбома. */
const badgeLabel = computed(() => {
  if (props.photoCount > 0) return `${props.photoCount} фото`

  return props.hasVideo ? 'Видео' : ''
})

function onActivate(): void {
  if (!props.to) {
    emit('select')
  }
}
</script>

<template>
  <article :id="id" :class="$style.root">
    <component
      :is="isLink ? NuxtLink : 'button'"
      v-if="isInteractive"
      :class="$style.hit"
      v-bind="isLink ? { to: props.to } : { type: 'button' }"
      :aria-labelledby="titleId"
      @click="onActivate"
    />

    <div :class="$style.media">
      <img
        :class="$style.image"
        :src="coverSrc"
        :alt="imageAlt"
        width="768"
        height="500"
        loading="lazy"
        decoding="async"
      >

      <UiTag v-if="badgeLabel" :class="$style.photoTag" variant="other">
        {{ badgeLabel }}
      </UiTag>
    </div>

    <div :class="$style.copy">
      <p :class="$style.date">{{ date }}</p>
      <h3 :id="titleId" :class="$style.title">{{ title }}</h3>
    </div>
  </article>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  min-width: 0;
  height: 100%;
}

.hit {
  position: absolute;
  inset: 0;
  z-index: z('default');
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--fs-radius-2xl);
  text-decoration: none;
  background: transparent;
  cursor: pointer;
  appearance: none;

  @include from-desktop {
    border-radius: var(--fs-radius-3xl);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.media {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 343 / 240;
  border-radius: var(--fs-radius-2xl);
  overflow: clip;
  pointer-events: none;

  @include from-desktop {
    aspect-ratio: 768 / 500;
    border-radius: var(--fs-radius-3xl);
  }
}

.image {
  position: absolute;
  inset: 0;
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
  pointer-events: none;
}

.date {
  margin: 0;
  @include fs-text-md;
  color: var(--fs-color-gray);
}

.title {
  margin: 0;
  @include fs-h4;
  @include fs-line-clamp(2);
  color: var(--fs-color-black);
}

@include from-desktop {
  .image {
    transition: transform 0.45s ease;
  }

  @media (hover: hover) {
    .root:hover .image {
      transform: scale(1.14);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .image {
    transition: none;
    transform: none;
  }
}
</style>
