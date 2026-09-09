<script setup lang="ts">
import type { GiftCardsFeature } from '#shared/types/giftCards'

const { title, imageSrc, imageAlt, items } = defineProps<{
  title: string
  imageSrc: string
  imageAlt: string
  items: GiftCardsFeature[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="gift-cards-features-title">
    <h2 id="gift-cards-features-title" :class="$style.title">{{ title }}</h2>

    <div :class="$style.body">
      <ul :class="$style.list">
        <li
          v-for="item in items"
          :key="item.id"
          :class="$style.item"
        >
          <h3 :class="$style.itemTitle">{{ item.title }}</h3>
          <p :class="$style.itemText">{{ item.text }}</p>
        </li>
      </ul>

      <div :class="$style.media">
        <img
          :class="$style.image"
          :src="imageSrc"
          :alt="imageAlt"
          width="900"
          height="600"
          loading="lazy"
          decoding="async"
        >
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    gap: rem(40);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    flex-direction: row;
    gap: rem(40);
    align-items: flex-start;
  }
}

.list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 0;

  @include from-desktop {
    flex: 1 1 rem(640);
  }
}

.item {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  padding-block: var(--fs-space-3);
  border-bottom: rem(2) solid var(--fs-color-light);

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  @include from-desktop {
    gap: rem(12);
    padding-block: rem(32);
  }
}

.itemTitle {
  @include fs-h3;
  margin: 0;
  overflow-wrap: break-word;
}

.itemText {
  margin: 0;
  @include fs-text-lg;
  overflow-wrap: break-word;
}

.media {
  flex: 0 0 auto;
  min-width: 0;
  overflow: hidden;
  border-radius: rem(32);

  @include from-desktop {
    flex: 0 0 rem(480);
    border-radius: rem(60);
  }

  @include from-wide {
    flex-basis: rem(768);
  }
}

.image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
