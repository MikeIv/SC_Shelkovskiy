<script setup lang="ts">
import type { RulesDocument } from '#shared/types/rules'

defineProps<{
  items: readonly RulesDocument[]
}>()
</script>

<template>
  <ul
    :class="$style.list"
    aria-label="Документы с правилами"
  >
    <li
      v-for="item in items"
      :key="item.id"
    >
      <a
        :class="$style.link"
        :href="item.href"
      >
        <UIcon
          name="local:file-dock"
          :class="$style.icon"
          aria-hidden="true"
        />
        <span :class="$style.title">{{ item.title }}</span>
      </a>
    </li>
  </ul>
</template>

<style module lang="scss">
@use 'tools' as *;

.list {
  display: grid;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.link {
  display: flex;
  gap: var(--fs-space-2);
  align-items: center;
  min-width: 0;
  padding: var(--fs-space-3);
  color: var(--fs-color-black);
  text-decoration: none;
  background-color: var(--fs-color-light);
  border-radius: rem(32);
  transition: background-color 0.2s ease;

  @media (hover: hover) {
    &:hover {
      background-color: var(--fs-color-light-hover);
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.icon {
  flex-shrink: 0;
  width: rem(32);
  height: rem(32);
}

.title {
  min-width: 0;
  @include fs-h4;
  overflow-wrap: break-word;
}
</style>
