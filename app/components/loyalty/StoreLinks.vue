<script setup lang="ts">
import type { LoyaltyStoreLink } from '#shared/types/loyalty'

withDefaults(
  defineProps<{
    items: LoyaltyStoreLink[]
    direction?: 'row' | 'column'
  }>(),
  {
    direction: 'row',
  },
)
</script>

<template>
  <ul
    :class="$style.root"
    :data-direction="direction"
  >
    <li
      v-for="item in items"
      :key="item.id"
      :class="$style.item"
    >
      <a
        :class="$style.link"
        :href="item.href"
      >
        <img
          :class="$style.badge"
          :src="item.imageSrc"
          :alt="item.label"
          :width="item.width"
          :height="item.height"
          decoding="async"
        >
      </a>
    </li>
  </ul>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2);
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;

  &[data-direction='column'] {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }
}

.item {
  margin: 0;
}

.link {
  display: block;
  line-height: 0;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
    border-radius: rem(8);
  }
}

.badge {
  display: block;
  width: auto;
  height: rem(44);
  object-fit: contain;

  @include from-desktop {
    height: rem(53);
  }
}
</style>
