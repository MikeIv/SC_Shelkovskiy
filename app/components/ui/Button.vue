<script setup lang="ts">
import { NuxtLink } from '#components'

export type UiButtonVariant = 'primary' | 'auth'
export type UiButtonSize = 'chrome'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: UiButtonVariant
    size?: UiButtonSize
    to?: string
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'chrome',
    to: undefined,
  },
)

const rootTag = computed(() => (props.to ? NuxtLink : 'button'))
const rootBind = computed(() => (props.to ? { to: props.to } : { type: props.type }))
</script>

<template>
  <component
    :is="rootTag"
    :class="$style.root"
    :data-variant="variant"
    :data-size="size"
    v-bind="rootBind"
  >
    <span :class="$style.label">
      <slot />
    </span>
  </component>
</template>

<style module lang="scss">
@use 'tools' as *;

@mixin fs-button-fill {
  color: var(--fs-color-white);

  &::before {
    width: calc(100% + #{rem(159)});
  }
}

.root {
  position: relative;
  display: inline-flex;
  gap: rem(10);
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: rem(12) rem(20);
  border: 0;
  border-radius: rem(100);
  @include fs-text-md;
  color: var(--fs-color-black);
  white-space: nowrap;
  background-color: var(--fs-color-beige);
  overflow: hidden;
  cursor: pointer;
  appearance: none;
  text-decoration: none;
  transition: color 0.35s ease;

  @include from-desktop {
    padding: var(--fs-space-2) var(--fs-space-3);
  }

  &::before {
    position: absolute;
    top: 50%;
    left: rem(-78);
    width: rem(73);
    height: rem(105);
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
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
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
  z-index: z('default');
}
</style>
