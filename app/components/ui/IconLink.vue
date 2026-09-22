<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  icon: string
  to?: string
}>()

const rootTag = computed(() => (props.to ? NuxtLink : 'span'))

const rootBind = computed(() => (props.to ? { to: props.to } : {}))
</script>

<template>
  <component
    :is="rootTag"
    :class="$style.root"
    v-bind="rootBind"
  >
    <UIcon :name="icon" :class="$style.icon" aria-hidden="true" />
    <span :class="$style.text">
      <slot />
    </span>
  </component>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: inline-flex;
  gap: rem(8);
  align-items: center;
  @include fs-text-md;
  color: var(--fs-color-black);
  text-decoration: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.icon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}

.text {
  text-decoration: none;
  text-underline-offset: rem(3);
}

@media (hover: hover) {
  .root:hover .text,
  :global(a:hover) .text {
    text-decoration-line: underline;
  }
}
</style>
