<script setup lang="ts">
const model = defineModel<string | number | boolean>()

defineProps<{
  value: string | number | boolean
}>()
</script>

<template>
  <input v-model="model" :class="$style.root" type="radio" :value="value">
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  --fs-choice-mark: var(--fs-color-black);

  @include fs-choice-control;

  &::before,
  &::after {
    @include fs-choice-mark;
    border-radius: 50%;
  }

  &::before {
    width: rem(18);
    height: rem(18);
    border: rem(2) solid var(--fs-color-gray);
    transition: border-color 0.2s ease;
  }

  &::after {
    width: rem(10);
    height: rem(10);
    background-color: var(--fs-choice-mark);
    opacity: 0;
    transition:
      opacity 0.2s ease,
      background-color 0.2s ease;
  }

  &:checked::before {
    border-color: var(--fs-choice-mark);
  }

  &:checked::after {
    opacity: 1;
  }

  &:disabled {
    --fs-choice-mark: var(--fs-color-gray);
  }

  @media (hover: hover) {
    &:not(:disabled):not(:checked):hover::before {
      border-color: var(--fs-color-black);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      transition: none;
    }
  }
}
</style>
