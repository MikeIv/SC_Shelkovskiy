<script setup lang="ts">
import type { AwardsDetailItem } from '#shared/types/awards'

defineProps<{
  item: AwardsDetailItem
}>()
</script>

<template>
  <article :class="$style.root">
    <header :class="$style.header">
      <time
        :class="$style.date"
        :datetime="item.dateIso"
      >
        {{ item.date }}
      </time>
      <h1 :class="$style.title">{{ item.title }}</h1>
    </header>

    <div :class="$style.layout">
      <div :class="$style.content">
        <h2 :class="$style.subtitle">{{ item.subtitle }}</h2>
        <div :class="$style.paragraphs">
          <p
            v-for="(paragraph, index) in item.paragraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <div :class="$style.media">
        <img
          :class="$style.image"
          :src="item.imageSrc"
          :alt="item.imageAlt"
          width="768"
          height="512"
          loading="lazy"
          decoding="async"
        >
      </div>
    </div>
  </article>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  width: 100%;

  @include from-desktop {
    gap: rem(56);
  }
}

.header {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.date {
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

.title {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
  overflow-wrap: break-word;
}

.layout {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);

  @include from-desktop {
    flex-direction: row;
    gap: var(--fs-space-3);
    align-items: flex-start;
    justify-content: space-between;
  }
}

.content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include from-desktop {
    flex-basis: rem(768);
    max-width: rem(768);
  }
}

.subtitle {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
}

.paragraphs {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);

  p {
    margin: 0;
    @include fs-text-lg;
    color: var(--fs-color-black);
  }
}

.media {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  overflow: clip;
  border-radius: rem(32);

  @include from-desktop {
    position: sticky;
    top: var(--fs-space-4);
    flex-basis: rem(768);
    max-width: rem(768);
    border-radius: rem(60);
  }
}

.image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 768 / 512;
  object-fit: cover;
  object-position: center;
}
</style>
