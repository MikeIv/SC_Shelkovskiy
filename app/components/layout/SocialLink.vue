<script setup lang="ts">
import type { LayoutSocial } from '#shared/types/layout'

defineProps<{
  item: LayoutSocial
}>()
</script>

<template>
  <a
    :class="$style.link"
    :href="item.href"
    :aria-label="item.label"
    rel="noopener noreferrer"
    target="_blank"
    :style="item.hoverColor ? { '--social-hover': item.hoverColor } : undefined"
  >
    <UIcon
      v-if="item.icon"
      :name="item.icon"
      :class="$style.icon"
      aria-hidden="true"
    />
    <img
      v-else-if="item.iconSrc"
      :class="$style.icon"
      :src="item.iconSrc"
      alt=""
      width="44"
      height="44"
      decoding="async"
    >
  </a>
</template>

<style module lang="scss">
@use 'tools' as *;

.link {
  display: block;
  flex-shrink: 0;
  line-height: 0;
  color: var(--fs-color-black);
  border-radius: 50%;
  transition: color 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus-visible {
    color: var(--social-hover, var(--fs-color-beige));
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--social-hover, var(--fs-color-beige));
    }
  }
}

.icon {
  display: block;
  width: rem(44);
  height: rem(44);
  color: inherit;
  object-fit: contain;
}
</style>
