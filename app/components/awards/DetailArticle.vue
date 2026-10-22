<script setup lang="ts">
import type { AwardsDetailItem } from '#shared/types/awards'

const props = defineProps<{
  item: AwardsDetailItem
}>()

/** Картинки API (`/storage/…` стенда) идут через ipx: прямой запрос к хранилищу без Basic не отдаётся. */
const mediaSrc = useMediaSrc()
const imageSrc = computed(() => mediaSrc(props.item.imageSrc, 1536))
</script>

<template>
  <article :class="$style.root">
    <header :class="$style.header">
      <time
        v-if="item.date"
        :class="$style.date"
        :datetime="item.dateIso"
      >
        {{ item.date }}
      </time>
      <h1 :class="$style.title">{{ item.title }}</h1>
    </header>

    <div
      v-if="item.subtitle || item.bodyHtml || item.paragraphs.length || imageSrc"
      :class="$style.layout"
    >
      <div
        v-if="item.subtitle || item.bodyHtml || item.paragraphs.length"
        :class="$style.content"
      >
        <h2
          v-if="item.subtitle"
          :class="$style.subtitle"
        >
          {{ item.subtitle }}
        </h2>
        <!-- eslint-disable-next-line vue/no-v-html -- HTML из CMS прошёл sanitizeApiHtml: script/style сняты, из атрибутов остаётся только безопасный href -->
        <div v-if="item.bodyHtml" :class="$style.body" v-html="item.bodyHtml" />
        <div
          v-else-if="item.paragraphs.length"
          :class="$style.paragraphs"
        >
          <p
            v-for="(paragraph, index) in item.paragraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <div
        v-if="imageSrc"
        :class="$style.media"
      >
        <img
          :class="$style.image"
          :src="imageSrc"
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

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);

  p,
  li {
    margin: 0;
    @include fs-text-lg;
    color: var(--fs-color-black);
  }

  ul,
  ol {
    display: flex;
    flex-direction: column;
    gap: rem(12);
    margin: 0;
    padding-left: rem(20);
  }

  h2,
  h3 {
    margin: 0;
    @include fs-text-lg;
    font-weight: 700;
    color: var(--fs-color-black);
  }

  a {
    color: var(--fs-color-black);
  }
}

.media {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  border-radius: rem(32);
  overflow: clip;

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
