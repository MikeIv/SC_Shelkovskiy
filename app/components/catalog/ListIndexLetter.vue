<script setup lang="ts">
defineProps<{
  letter: string
  available: boolean
}>()

const emit = defineEmits<{
  select: [letter: string]
}>()
</script>

<template>
  <button
    v-if="available"
    :class="$style.letter"
    type="button"
    @click="emit('select', letter)"
  >
    {{ letter }}
  </button>
  <span v-else :class="[$style.letter, $style.inactive]">
    {{ letter }}
  </span>
</template>

<style module lang="scss">
@use 'tools' as *;

.letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: rem(38);
  margin: 0;
  padding: rem(4);
  border: 0;
  @include fs-h4;
  color: var(--fs-color-black);
  background: none;
  cursor: pointer;
  appearance: none;
  transition: color 0.2s ease;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
    border-radius: rem(2);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--fs-color-beige);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.inactive {
  color: var(--fs-color-gray);
  cursor: default;
  pointer-events: none;
}
</style>
