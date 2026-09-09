<script setup lang="ts">
import type { LoyaltyStoreLink } from '#shared/types/loyalty'
import type { UiBreadcrumbItem } from '~/components/ui/Breadcrumbs.vue'

const {
  title,
  downloadLabel,
  shapesSrc,
  phonesSrc,
  shadowSrc,
  storeLinks,
  breadcrumbs,
} = defineProps<{
  title: string
  downloadLabel: string
  shapesSrc: string
  phonesSrc: string
  shadowSrc: string
  storeLinks: LoyaltyStoreLink[]
  breadcrumbs: UiBreadcrumbItem[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="loyalty-hero-title">
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
          <h1 id="loyalty-hero-title" :class="$style.title">
            {{ title }}
          </h1>
          <p :class="$style.download">{{ downloadLabel }}</p>
          <LoyaltyStoreLinks :items="storeLinks" />
        </div>

        <div :class="$style.media" aria-hidden="true">
          <img
            :class="$style.shadow"
            :src="shadowSrc"
            alt=""
            width="872"
            height="618"
            decoding="async"
          >
          <img
            :class="$style.phones"
            :src="phonesSrc"
            alt=""
            width="588"
            height="588"
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
  max-width: rem(720);
  min-width: 0;
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.download {
  margin: 0;
  @include fs-text;

  @include from-desktop {
    @include fs-text-lg;
  }
}

.media {
  position: relative;
  align-self: center;
  width: min(100%, rem(360));
  aspect-ratio: 1;
  pointer-events: none;

  @include from-desktop {
    flex: 0 0 auto;
    align-self: flex-end;
    width: rem(520);
    margin-right: rem(-40);
  }

  @include from-wide {
    width: rem(620);
    margin-right: rem(-80);
  }
}

.shadow {
  position: absolute;
  top: 42%;
  left: 8%;
  width: 92%;
  height: auto;
}

.phones {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
