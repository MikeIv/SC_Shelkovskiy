<script setup lang="ts">
import type { AboutFeature } from '#shared/types/about'

const { feature } = defineProps<{
  feature: AboutFeature
}>()
</script>

<template>
  <article :class="$style.root">
    <div :class="$style.media">
      <img
        :class="$style.image"
        :src="feature.imageSrc"
        :alt="feature.imageAlt"
        width="382"
        height="380"
        loading="lazy"
        decoding="async"
      >
    </div>

    <div :class="$style.body">
      <div :class="$style.copy">
        <h3 :class="$style.title">{{ feature.title }}</h3>
        <p :class="$style.desc">{{ feature.description }}</p>
      </div>

      <ul v-if="feature.stats?.length" :class="$style.stats">
        <li
          v-for="stat in feature.stats"
          :key="`${feature.id}-${stat.label}`"
          :class="$style.stat"
        >
          <span :class="$style.statValue">{{ stat.value }}</span>
          <span :class="$style.statLabel">{{ stat.label }}</span>
        </li>
      </ul>
    </div>
  </article>
</template>

<style module lang="scss">
@use 'tools' as *;

$feature-title-lines: 2;
$feature-desc-lines: 3;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  height: 100%;
  padding: var(--fs-space-2);
  overflow: clip;
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-desktop {
    flex-direction: row;
    gap: var(--fs-space-3);
    align-items: center;
    padding: var(--fs-space-3);
    border-radius: rem(60);
  }
}

.media {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  overflow: clip;
  border-radius: rem(24);
  aspect-ratio: 1 / 1;

  @include from-desktop {
    width: rem(382);
    height: rem(380);
    aspect-ratio: auto;
    border-radius: rem(32);
  }
}

.image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--fs-space-3);
  justify-content: space-between;
  min-width: 0;
  padding-block: var(--fs-space-1);

  @include from-desktop {
    padding-block: var(--fs-space-2);
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.title {
  @include fs-h2;
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  min-height: #{$feature-title-lines}lh;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $feature-title-lines;
  line-clamp: $feature-title-lines;
}

.desc {
  margin: 0;
  @include fs-text-lg;
  display: -webkit-box;
  overflow: hidden;
  min-height: #{$feature-desc-lines}lh;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $feature-desc-lines;
  line-clamp: $feature-desc-lines;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2) var(--fs-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.stat {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.statValue {
  @include fs-h3;
}

.statLabel {
  @include fs-text-lg;
}
</style>
