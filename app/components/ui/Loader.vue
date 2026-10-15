<script setup lang="ts">
export type UiLoaderSize = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    size?: UiLoaderSize
    label?: string
  }>(),
  {
    size: 'md',
    label: 'Загрузка',
  },
)
</script>

<template>
  <span
    :class="$style.root"
    :data-size="size"
    role="status"
    :aria-label="label"
  />
</template>

<style module lang="scss">
@use 'tools' as *;

/* Spinner #26 — css-loaders.com/spinner, цвета проекта */
.root {
  --fs-loader-size: #{rem(40)};
  --fs-loader-color: var(--fs-color-red);

  display: inline-grid;
  flex-shrink: 0;
  width: var(--fs-loader-size);
  aspect-ratio: 1;
  background:
    radial-gradient(closest-side at 50% 12.5%, var(--fs-loader-color) 96%, #0000) 50% 0 / 20% 80%
      repeat-y,
    radial-gradient(closest-side at 12.5% 50%, var(--fs-loader-color) 96%, #0000) 0 50% / 80% 20%
      repeat-x;
  animation: fs-loader-spin 1s infinite steps(12);
  -webkit-mask: conic-gradient(from 15deg, #0000, #000);
  mask: conic-gradient(from 15deg, #0000, #000);

  &[data-size='sm'] {
    --fs-loader-size: #{rem(24)};
  }

  &[data-size='lg'] {
    --fs-loader-size: #{rem(64)};
  }

  &::before,
  &::after {
    grid-area: 1 / 1;
    background: inherit;
    content: '';
    transform: rotate(30deg);
  }

  &::after {
    transform: rotate(60deg);
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 0.72;
    animation: none;
  }
}

@keyframes fs-loader-spin {
  100% {
    transform: rotate(1turn);
  }
}
</style>
