<script setup lang="ts">
import type { EventAfishaItem } from '#shared/types/events'
import { getEventDetailPath } from '#shared/utils/eventsPath'

const props = defineProps<{
  item: EventAfishaItem
}>()

const linkTarget = computed(() => props.item.to ?? getEventDetailPath(props.item.id))
</script>

<template>
  <NuxtLink
    :to="linkTarget"
    :class="$style.root"
  >
    <div :class="$style.dates">
      <p :class="$style.date">
        <span :class="$style.day">{{ item.dateStart.day }}</span>
        <span :class="$style.month">{{ item.dateStart.month }}</span>
      </p>
      <template v-if="item.dateEnd">
        <span :class="$style.dash">—</span>
        <p :class="$style.date">
          <span :class="$style.day">{{ item.dateEnd.day }}</span>
          <span :class="$style.month">{{ item.dateEnd.month }}</span>
        </p>
      </template>
    </div>

    <div :class="$style.media">
      <img
        v-if="item.imageSrc"
        :class="$style.image"
        :src="item.imageSrc"
        :alt="item.imageAlt"
        width="504"
        height="334"
        loading="lazy"
        decoding="async"
      >
      <div v-else :class="$style.imagePlaceholder" aria-hidden="true">
        <UiLogo :class="$style.imageFallback" />
      </div>
    </div>

    <div :class="$style.body">
      <UiTag variant="afisha">{{ item.tagLabel }}</UiTag>

      <div :class="$style.copy">
        <h2 :class="$style.title">{{ item.title }}</h2>
        <p :class="$style.description">{{ item.description }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: flex-start;
  width: 100%;
  color: inherit;
  text-decoration: none;

  @include from-tablet {
    flex-direction: row;
    align-items: center;
  }

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.dates {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: center;

  @include from-tablet {
    width: rem(146);
  }

  @include from-desktop {
    width: rem(240);
  }
}

.date {
  display: flex;
  gap: var(--fs-space-1);
  align-items: baseline;
  margin: 0;
  color: var(--fs-color-black);
  white-space: nowrap;
}

.day {
  @include fs-h2;
}

.month {
  @include fs-h3;
}

.dash {
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(32);
  @include fs-h3;
  color: var(--fs-color-black);

  @include from-desktop {
    width: rem(58);
  }
}

.media {
  flex-shrink: 0;
  width: 100%;
  height: rem(228);
  overflow: clip;
  border-radius: rem(24);

  @include from-tablet {
    flex: 1 0 0;
    width: auto;
    min-width: 0;
    height: rem(180);
  }

  @include from-desktop {
    flex: 0 0 rem(504);
    width: rem(504);
    height: rem(334);
    border-radius: rem(32);
  }
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.imagePlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--fs-color-light);
}

.imageFallback {
  width: rem(120);
  opacity: 0.25;

  @include from-desktop {
    width: rem(160);
  }
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: flex-start;
  min-width: 0;
  width: 100%;

  @include from-tablet {
    flex: 1 0 0;
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  min-width: 0;
  width: 100%;
}

.title {
  margin: 0;
  @include fs-h3;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  color: var(--fs-color-black);
}

.description {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

@include from-desktop {
  .image {
    transition: transform 0.45s ease;
  }

  @media (hover: hover) {
    .root:hover .image {
      transform: scale(1.12);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .image {
    transition: none;
    transform: none;
  }
}
</style>
