<script setup lang="ts">
import type { UiBreadcrumbItem } from '~/components/ui/Breadcrumbs.vue'

const {
  title,
  description,
  shapesSrc,
  cardFrontSrc,
  cardBackSrc,
  breadcrumbs,
} = defineProps<{
  title: string
  description: string
  shapesSrc: string
  cardFrontSrc: string
  cardBackSrc: string
  breadcrumbs: UiBreadcrumbItem[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="gift-cards-hero-title">
    <div :class="$style.bg" aria-hidden="true">
      <img
        :class="$style.shapes"
        :src="shapesSrc"
        alt=""
        width="1893"
        height="1888"
        decoding="async"
      >
    </div>

    <div :class="$style.chrome">
      <UiBreadcrumbs :items="breadcrumbs" />

      <div :class="$style.body">
        <div :class="$style.copy">
          <h1 id="gift-cards-hero-title" :class="$style.title">
            {{ title }}
          </h1>
          <p :class="$style.desc">{{ description }}</p>
        </div>

        <div :class="$style.media" aria-hidden="true">
          <img
            :class="$style.cardBack"
            :src="cardBackSrc"
            alt=""
            width="573"
            height="373"
            decoding="async"
          >
          <img
            :class="$style.cardFront"
            :src="cardFrontSrc"
            alt=""
            width="573"
            height="373"
            decoding="async"
            fetchpriority="high"
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  overflow: clip;
  color: var(--fs-color-black);
  background-image: linear-gradient(
    115deg,
    #ede3d1 3%,
    #f8f1e6 52%,
    #ede3d1 100%
  );
  border-end-start-radius: rem(32);
  border-end-end-radius: rem(32);

  @include from-desktop {
    border-end-start-radius: rem(60);
    border-end-end-radius: rem(60);
  }
}

.bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.shapes {
  position: absolute;
  top: rem(-80);
  left: 35%;
  width: rem(900);
  height: auto;
  max-width: none;
  opacity: 0.9;

  @include from-desktop {
    top: rem(-170);
    left: 26%;
    width: rem(1400);
  }

  @include from-wide {
    width: rem(1893);
  }
}

.chrome {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  padding-block: var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: var(--fs-space-5);
    min-height: rem(780);
    padding-top: var(--fs-space-5);
    padding-bottom: rem(100);
  }
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    flex-direction: row;
    gap: var(--fs-space-5);
    align-items: flex-end;
    justify-content: space-between;
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  max-width: rem(760);
  min-width: 0;
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.desc {
  margin: 0;
  @include fs-text;
}

.media {
  position: relative;
  align-self: center;
  width: min(100%, rem(340));
  aspect-ratio: 1.15;
  pointer-events: none;

  @include from-desktop {
    flex: 0 0 auto;
    align-self: flex-end;
    width: rem(560);
    margin-right: rem(-24);
  }

  @include from-wide {
    width: rem(680);
    margin-right: rem(-40);
  }
}

.cardBack {
  position: absolute;
  top: 38%;
  left: 28%;
  width: 72%;
  height: auto;
  object-fit: contain;
  transform: rotate(-19.83deg);
}

.cardFront {
  position: absolute;
  top: 8%;
  left: 0;
  width: 72%;
  height: auto;
  object-fit: contain;
  transform: rotate(7.29deg);
}
</style>
