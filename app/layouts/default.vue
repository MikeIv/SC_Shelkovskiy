<script setup lang="ts"></script>

<template>
  <div :class="$style.root">
    <LayoutHeader />
    <main id="content" :class="$style.main" tabindex="-1">
      <slot />
    </main>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  min-height: 100dvh;
}

.main:focus-visible {
  outline: rem(2) solid var(--fs-color-black);
  outline-offset: rem(2);
}
</style>
