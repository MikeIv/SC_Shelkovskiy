<script setup lang="ts">
/**
 * Ярлык «демо-данные»: презентационный, без привязки к `useDemoData`.
 * Родитель решает, когда показывать (секция с моком или глобальная плашка).
 */
defineProps<{
  /** Подсказка: какой источник подменён. */
  title?: string
}>()
</script>

<template>
  <p
    :class="$style.root"
    role="status"
    aria-live="polite"
    data-demo-badge
    :title="title"
  >
    <span :class="$style.dot" aria-hidden="true" />
    <span>Демо-данные</span>
  </p>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: inline-flex;
  gap: rem(8);
  align-items: center;
  padding: rem(6) rem(12);
  border-radius: rem(100);
  @include fs-text-sm;

  font-weight: 500;
  color: var(--fs-color-white);
  pointer-events: none;
  background-color: color-mix(in srgb, var(--fs-color-black) 82%, transparent);
  backdrop-filter: blur(rem(4));
}

.dot {
  width: rem(8);
  height: rem(8);
  border-radius: 50%;
  background-color: var(--fs-color-red);
}
</style>
