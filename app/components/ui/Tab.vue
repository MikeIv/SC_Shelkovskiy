<script setup lang="ts">
export type UiTabVariant = 'default' | 'circle'

withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: UiTabVariant
    selected?: boolean
    icon?: string
  }>(),
  {
    type: 'button',
    variant: 'default',
    selected: false,
    icon: '',
  },
)
</script>

<template>
  <button
    :class="$style.root"
    :type="type"
    :data-variant="variant"
    :aria-pressed="selected"
  >
    <UIcon v-if="icon" :name="icon" :class="$style.icon" aria-hidden="true" />
    <span v-if="$slots.default" :class="variant === 'circle' ? $style.srOnly : undefined">
      <slot />
    </span>
  </button>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  --fs-tab-ring: var(--fs-color-light);

  position: relative;
  display: inline-flex;
  gap: var(--fs-space-1);
  align-items: center;
  justify-content: center;
  min-height: rem(44);
  margin: 0;
  padding: rem(12) rem(20);
  border: 0;
  border-radius: rem(100);
  @include fs-text-lg;
  color: var(--fs-color-black);
  white-space: nowrap;
  background-color: var(--fs-color-white);
  box-shadow: 0 0 0 rem(2) var(--fs-tab-ring);
  cursor: pointer;
  appearance: none;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  @include from-desktop {
    min-height: rem(56);
    padding-inline: var(--fs-space-3);
  }

  &[data-variant='default'] .icon {
    @include from-desktop {
      width: rem(32);
      height: rem(32);
    }
  }

  &[data-variant='circle'] {
    flex-shrink: 0;
    width: rem(44);
    height: rem(44);
    padding: 0;

    @include from-desktop {
      width: rem(56);
      height: rem(56);

      .icon {
        width: rem(24);
        height: rem(24);
      }
    }
  }

  &[aria-pressed='true'] {
    background-color: var(--fs-color-light);
  }

  &:focus-visible:not(:disabled) {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  &:disabled {
    color: var(--fs-color-gray);
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:not(:disabled):not([aria-pressed='true']):hover {
      --fs-tab-ring: var(--fs-color-light-hover);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.icon {
  flex-shrink: 0;
  width: rem(20);
  height: rem(20);
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
