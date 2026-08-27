<script setup lang="ts">
export type UiButtonVariant = 'primary' | 'auth'
export type UiButtonSize = 'chrome'

withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: UiButtonVariant
    size?: UiButtonSize
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'chrome',
  },
)
</script>

<template>
  <button :class="$style.root" :type="type" :data-variant="variant" :data-size="size">
    <span :class="$style.label">
      <slot />
    </span>
  </button>
</template>

<style module lang="scss">
@use 'tools' as *;

@mixin fs-button-fill {
  color: var(--fs-color-white);

  &::before {
    width: calc(100% + 159px);
  }
}

.root {
  position: relative;
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 12px 20px;
  border: 0;
  border-radius: 100px;
  @include fs-text-md;
  color: var(--fs-color-black);
  white-space: nowrap;
  background-color: var(--fs-color-beige);
  overflow: hidden;
  cursor: pointer;
  appearance: none;
  transition: color 0.35s ease;

  @include from-desktop {
    padding: var(--fs-space-2) var(--fs-space-3);
  }

  &::before {
    position: absolute;
    top: 50%;
    left: -78px;
    z-index: 0;
    width: 73px;
    height: 105px;
    border-radius: 50%;
    background-color: var(--fs-color-black);
    pointer-events: none;
    content: '';
    transform: translateY(-50%);
    transition: width 0.35s ease;
  }

  &:not(:disabled):is(:focus-visible, :active) {
    @include fs-button-fill;
  }

  &:focus-visible:not(:disabled) {
    outline: 2px solid var(--fs-color-black);
    outline-offset: 2px;
  }

  &:disabled {
    color: var(--fs-color-gray);
    background-color: var(--fs-color-light-hover);
    cursor: not-allowed;

    &::before {
      content: none;
    }
  }

  @media (hover: hover) {
    &:not(:disabled):hover {
      @include fs-button-fill;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &::before {
      transition: none;
    }
  }
}

.label {
  position: relative;
  z-index: 1;
}
</style>
