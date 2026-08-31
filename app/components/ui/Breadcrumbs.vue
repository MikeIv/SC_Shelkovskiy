<script setup lang="ts">
import { NuxtLink } from '#components'

export type UiBreadcrumbItem = {
  label: string
  to?: string
}

const { items } = defineProps<{
  items: UiBreadcrumbItem[]
}>()

const lastIndex = computed(() => items.length - 1)
</script>

<template>
  <nav aria-label="Хлебные крошки">
    <ol :class="$style.list">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        :class="$style.item"
      >
        <NuxtLink
          v-if="index < lastIndex && item.to"
          :class="[$style.segment, $style.link]"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>

        <span
          v-else-if="index < lastIndex"
          :class="[$style.segment, $style.muted]"
        >
          {{ item.label }}
        </span>

        <span
          v-else
          :class="[$style.segment, $style.current]"
          aria-current="page"
        >
          {{ item.label }}
        </span>

        <UIcon
          v-if="index < lastIndex"
          name="local:chevron-right"
          :class="$style.separator"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>

<style module lang="scss">
@use 'tools' as *;

.list {
  display: flex;
  flex-wrap: wrap;
  gap: rem(4);
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: inline-flex;
  gap: rem(4);
  align-items: center;
  min-width: 0;
}

.segment {
  @include fs-text-lg;
  white-space: nowrap;
}

.muted,
.link {
  color: var(--fs-color-gray);
}

.link {
  text-decoration: none;
  transition: color 0.2s ease;

  @media (hover: hover) {
    &:hover {
      color: var(--fs-color-black);
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
    border-radius: rem(2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.current {
  color: var(--fs-color-black);
}

.separator {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
  color: var(--fs-color-gray);
}
</style>
