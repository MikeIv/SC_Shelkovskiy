<script setup lang="ts">
import type { UiBreadcrumbItem } from '~/components/ui/Breadcrumbs.vue'

const { title, description, imageSrc, imageAlt, breadcrumbs } = defineProps<{
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  breadcrumbs: UiBreadcrumbItem[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="about-hero-title">
    <div :class="$style.media">
      <img
        :class="$style.image"
        :src="imageSrc"
        :alt="imageAlt"
        width="1920"
        height="900"
        decoding="async"
      >
      <div :class="$style.dim" aria-hidden="true" />
    </div>

    <div :class="$style.chrome">
      <UiBreadcrumbs :items="breadcrumbs" variant="light" />

      <div :class="$style.copy">
        <h1 id="about-hero-title" :class="$style.title">{{ title }}</h1>
        <p :class="$style.desc">{{ description }}</p>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: rem(560);
  overflow: clip;
  color: var(--fs-color-white);
  background-color: var(--fs-color-black);
  border-end-start-radius: rem(32);
  border-end-end-radius: rem(32);

  @include from-desktop {
    min-height: rem(900);
    border-end-start-radius: rem(60);
    border-end-end-radius: rem(60);
  }
}

.media {
  position: absolute;
  inset: 0;
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.dim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-color: rgb(0 0 0 / 40%);
}

.chrome {
  position: relative;
  z-index: z('default');
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--fs-space-4);
  justify-content: space-between;
  padding: rem(140) var(--fs-grid-margin) var(--fs-space-4);

  @include from-desktop {
    padding-inline: max(
      var(--fs-grid-margin),
      calc((100% - var(--fs-grid-content-max)) / 2)
    );
    padding-top: rem(203);
    padding-bottom: rem(100);
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  max-width: rem(715);
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.desc {
  margin: 0;
  @include fs-text;
  overflow-wrap: break-word;

  @include from-desktop {
    @include fs-text-lg;
  }
}
</style>
