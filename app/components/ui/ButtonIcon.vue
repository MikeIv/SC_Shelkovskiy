<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    icon?: string
  }>(),
  {
    type: 'button',
    icon: 'local:map',
  },
)
</script>

<template>
  <button :class="$style.root" :type="type">
    <UIcon :name="icon" :class="$style.icon" aria-hidden="true" />
    <span :class="$style.label">
      <slot />
    </span>
  </button>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: inline-flex;
  gap: var(--fs-space-1);
  align-items: center;
  margin: 0;
  padding: 0;
  border: 0;
  border-bottom: rem(1) solid transparent;
  @include fs-text-md;
  color: var(--fs-color-black);
  white-space: nowrap;
  background-color: transparent;
  cursor: pointer;
  appearance: none;
  transition: border-color 0.2s ease;

  &:not(:disabled) {
    &:is(:focus-visible, :active) {
      border-bottom-color: currentColor;
    }

    &:focus-visible {
      outline: rem(2) solid var(--fs-color-black);
      outline-offset: rem(2);
    }
  }

  &:disabled {
    color: var(--fs-color-gray);
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:not(:disabled):hover {
      border-bottom-color: currentColor;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.icon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}

.label {
  min-width: 0;
}
</style>
