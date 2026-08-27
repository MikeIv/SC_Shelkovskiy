<script setup lang="ts">
export type UiLogoVariant = 'white' | 'black'

withDefaults(
  defineProps<{
    variant?: UiLogoVariant
  }>(),
  {
    variant: 'black',
  },
)
</script>

<template>
  <span
    :class="$style.root"
    :data-variant="variant"
    role="img"
    aria-label="Щёлковский"
  >
    <UIcon name="local:logo" :class="$style.icon" aria-hidden="true" />
  </span>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: inline-flex;
  flex-shrink: 0;
  overflow: clip;
  width: rem(161);
  aspect-ratio: 303 / 46;
  color: var(--fs-color-black);

  &[data-variant='white'] {
    color: var(--fs-color-white);
  }

  @include from-desktop {
    width: rem(303);
  }
}

.icon {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
