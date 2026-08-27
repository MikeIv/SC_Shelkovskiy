<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <input v-model="model" :class="$style.root" type="checkbox">
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  @include fs-choice-control;

  &::before,
  &::after {
    @include fs-choice-mark;
    width: rem(18);
    height: rem(18);
  }

  &::before {
    border-radius: rem(2);
    box-shadow: inset 0 0 0 #{rem(2)} var(--fs-color-gray);
    transition:
      background-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  &::after {
    background-color: var(--fs-color-white);
    opacity: 0;
    mask: url('~/assets/icons/check.svg') center / contain no-repeat;
  }

  &:checked::before {
    background-color: var(--fs-color-black);
    box-shadow: none;
  }

  &:checked::after {
    opacity: 1;
  }

  &:checked:disabled::before {
    background-color: var(--fs-color-gray);
  }

  @media (hover: hover) {
    &:not(:disabled):not(:checked):hover::before {
      box-shadow: inset 0 0 0 #{rem(2)} var(--fs-color-black);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }
  }
}
</style>
