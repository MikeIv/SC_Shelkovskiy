<script setup lang="ts">
import type { AwardsItem } from '#shared/types/awards'
import { getAwardsDetailPath } from '#shared/utils/awardsPath'

const { item } = defineProps<{
  item: AwardsItem
}>()
</script>

<template>
  <NuxtLink
    :to="getAwardsDetailPath(item.id)"
    :class="$style.root"
  >
    <div
      :class="$style.pattern"
      aria-hidden="true"
    >
      <img
        :class="$style.patternImage"
        src="/images/awards/card-pattern.svg"
        alt=""
        width="1220"
        height="1216"
        decoding="async"
      >
      <div :class="$style.patternFade" />
    </div>

    <div :class="$style.body">
      <time
        :class="$style.date"
        :datetime="item.dateIso"
      >{{ item.date }}</time>
      <span :class="$style.title">{{ item.title }}</span>
    </div>
  </NuxtLink>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--fs-space-3);
  overflow: clip;
  color: inherit;
  text-decoration: none;
  background-color: var(--fs-color-light);
  border-radius: rem(24);

  @include from-desktop {
    height: rem(260);
    padding: var(--fs-space-4);
    border-radius: rem(32);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.patternImage {
  position: absolute;
  right: rem(-360);
  bottom: rem(-360);
  width: rem(720);
  height: auto;
  max-width: none;

  @include from-desktop {
    right: rem(-599);
    bottom: rem(-608);
    width: rem(1220);
  }
}

.patternFade {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    138deg,
    var(--fs-color-light) 15%,
    rgb(243 242 237 / 0%) 87%
  );
}

.body {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  min-width: 0;
}

.date {
  @include fs-text-md;
  color: var(--fs-color-gray);
  white-space: nowrap;
}

.title {
  @include fs-h4;
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  color: var(--fs-color-black);
  overflow-wrap: break-word;
}
</style>
