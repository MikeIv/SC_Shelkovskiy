<template>
  <button :class="$style.root" type="button">
    <slot />
  </button>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  background: none;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
    border-radius: rem(2);
  }
}
</style>
