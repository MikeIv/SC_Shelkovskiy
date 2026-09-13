<script setup lang="ts">
export type UiTagVariant =
  | 'action'
  | 'afisha'
  | 'news'
  | 'other'
  | 'smi'
  | 'loyalty'
  | 'lunch'
  | 'period'

withDefaults(
  defineProps<{
    variant?: UiTagVariant
    icon?: string
  }>(),
  {
    variant: 'news',
    icon: '',
  },
)
</script>

<template>
  <span :class="$style.root" :data-variant="variant">
    <UIcon v-if="icon" :name="icon" :class="$style.icon" aria-hidden="true" />
    <slot />
  </span>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  --fs-tag-bg: var(--fs-color-red);
  --fs-tag-color: var(--fs-color-white);

  display: inline-flex;
  flex-shrink: 0;
  gap: var(--fs-space-1);
  align-items: center;
  justify-content: center;
  min-height: rem(24);
  padding: rem(4) rem(8);
  border-radius: rem(100);
  @include fs-text-sm;
  color: var(--fs-tag-color);
  white-space: nowrap;
  background-color: var(--fs-tag-bg);

  &[data-variant='afisha'] {
    /* Белый текст: затемнение синего для AA */
    --fs-tag-bg: color-mix(in srgb, var(--fs-color-blue) 72%, var(--fs-color-black));
  }

  &[data-variant='other'] {
    --fs-tag-bg: var(--fs-color-black);
  }

  &[data-variant='loyalty'] {
    --fs-tag-bg: var(--fs-color-sand);
    --fs-tag-color: var(--fs-color-black);
    background-image: linear-gradient(
      126deg,
      var(--fs-color-sand) 11%,
      var(--fs-color-cream) 51%,
      var(--fs-color-peach) 88%
    );
  }

  &[data-variant='lunch'] {
    --fs-tag-bg: var(--fs-color-green);
  }

  &[data-variant='period'] {
    --fs-tag-bg: var(--fs-color-light);
    --fs-tag-color: var(--fs-color-black);
  }

  @include from-desktop {
    min-height: rem(30);
    padding: rem(6) rem(12);
  }
}

.icon {
  flex-shrink: 0;
  width: rem(16);
  height: rem(16);
  overflow: clip;

  @include from-desktop {
    width: rem(18);
    height: rem(18);
  }
}
</style>
