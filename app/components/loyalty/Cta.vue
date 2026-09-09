<script setup lang="ts">
import type { LoyaltyStoreLink } from '#shared/types/loyalty'

const { title, supportText, supportLabel, supportHref, phonesSrc, shadowSrc, storeLinks } =
  defineProps<{
    title: string
    supportText: string
    supportLabel: string
    supportHref: string
    phonesSrc: string
    shadowSrc: string
    storeLinks: LoyaltyStoreLink[]
  }>()

const sides = ['left', 'right'] as const
</script>

<template>
  <section :class="$style.root" aria-labelledby="loyalty-cta-title">
    <div
      v-for="side in sides"
      :key="side"
      :class="$style.side"
      :data-side="side"
      aria-hidden="true"
    >
      <img
        :class="$style.shadow"
        :src="shadowSrc"
        alt=""
        width="503"
        height="356"
        loading="lazy"
        decoding="async"
      >
      <img
        :class="$style.phones"
        :src="phonesSrc"
        alt=""
        width="588"
        height="588"
        loading="lazy"
        decoding="async"
      >
    </div>

    <div :class="$style.content">
      <div :class="$style.top">
        <h2 id="loyalty-cta-title" :class="$style.title">{{ title }}</h2>
        <LoyaltyStoreLinks :items="storeLinks" />
      </div>

      <div :class="$style.support">
        <p :class="$style.supportText">{{ supportText }}</p>
        <UiButton :to="supportHref">
          {{ supportLabel }}
        </UiButton>
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
  align-items: center;
  min-height: rem(420);
  padding: var(--fs-space-5) var(--fs-space-3);
  overflow: clip;
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-desktop {
    min-height: rem(488);
    padding: rem(80) rem(40) rem(48);
  }
}

.side {
  display: none;
  pointer-events: none;

  @include from-desktop {
    position: absolute;
    top: rem(10);
    display: block;
    width: rem(420);
    height: rem(420);
  }

  @include from-wide {
    width: rem(520);
    height: rem(520);
  }

  &[data-side='left'] {
    left: rem(8);
  }

  &[data-side='right'] {
    right: rem(8);
    transform: scaleX(-1);
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

.content {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  align-items: center;
  width: min(100%, rem(816));

  @include from-desktop {
    gap: rem(120);
  }
}

.top {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: center;
  text-align: center;
}

.title {
  @include fs-h2;
  margin: 0;
  overflow-wrap: break-word;
}

.support {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: center;
  text-align: center;
}

.supportText {
  margin: 0;
  @include fs-text;
}
</style>
