<script setup lang="ts">
import type { UiBreadcrumbItem } from '~/components/ui/Breadcrumbs.vue'

const { title, imageSrc, imageAlt, breadcrumbs } = defineProps<{
  title: string
  imageSrc: string
  imageAlt: string
  breadcrumbs: UiBreadcrumbItem[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="responsibility-hero-title">
    <img
      :class="$style.image"
      :src="imageSrc"
      :alt="imageAlt"
      width="1280"
      height="854"
      fetchpriority="high"
    >
    <div :class="$style.dim" aria-hidden="true" />

    <div :class="$style.chrome">
      <UiBreadcrumbs :items="breadcrumbs" variant="light" />

      <h1 id="responsibility-hero-title" :class="$style.title">
        {{ title }}
      </h1>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: rem(750);
  color: var(--fs-color-white);
  background-color: var(--fs-color-black);
  overflow: clip;
  border-end-start-radius: var(--fs-radius-3xl);
  border-end-end-radius: var(--fs-radius-3xl);

  @include from-desktop {
    min-height: rem(900);
    border-end-start-radius: var(--fs-radius-4xl);
    border-end-end-radius: var(--fs-radius-4xl);
  }
}

.image {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;

  /* Кадр макета отражает фото по горизонтали. */
  transform: scaleX(-1);
}

.dim {
  position: absolute;
  inset: 0;
  background-color: rgb(0 0 0 / 40%);
  pointer-events: none;
}

.chrome {
  position: relative;
  z-index: z('default');
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(var(--fs-header-height) + var(--fs-space-3))
    var(--fs-grid-margin) var(--fs-space-4);

  @include from-desktop {
    padding-top: rem(203);
    padding-bottom: rem(100);
    padding-inline: max(
      var(--fs-grid-margin),
      calc((100% - var(--fs-grid-content-max)) / 2)
    );
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;

  @include from-desktop {
    max-width: rem(1335);
  }
}
</style>
