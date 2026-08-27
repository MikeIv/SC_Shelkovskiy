<script setup lang="ts">
export type UiButtonArrowDirection = 'left' | 'right'
export type UiButtonArrowVariant = 'light' | 'black'

withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    direction?: UiButtonArrowDirection
    variant?: UiButtonArrowVariant
  }>(),
  {
    type: 'button',
    direction: 'left',
    variant: 'black',
  },
)
</script>

<template>
  <button
    :class="$style.root"
    :type="type"
    :data-direction="direction"
    :data-variant="variant"
  >
    <UIcon name="local:button-arrow" :class="$style.icon" aria-hidden="true" />
    <span v-if="$slots.default" :class="$style.srOnly">
      <slot />
    </span>
  </button>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: rem(80);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--fs-color-black);
  background-color: transparent;
  cursor: pointer;
  appearance: none;
  transition: color 0.2s ease;

  @include from-desktop {
    width: rem(100);
    height: rem(56);
  }

  &[data-variant='light'] {
    color: var(--fs-color-white);
  }

  &[data-direction='left'] .icon {
    transform: scaleX(-1);
  }

  &:not(:disabled) {
    &:is(:focus-visible, :active) {
      color: var(--fs-color-beige);
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

  &[data-variant='light']:disabled {
    color: var(--fs-color-light);
  }

  @media (hover: hover) {
    &:not(:disabled):hover {
      color: var(--fs-color-beige);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.icon {
  width: 100%;
  height: 100%;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
