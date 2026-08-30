<script setup lang="ts">
const route = useRoute()

const headerOverlay = computed(() => Boolean(route.meta.headerOverlay))
const headerVariant = computed(() => (headerOverlay.value ? 'white' : 'black'))
</script>

<template>
  <div :class="$style.root">
    <LayoutHeader :variant="headerVariant" :overlay="headerOverlay" />
    <main id="content" :class="$style.main" tabindex="-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.main {
  flex: 1 1 auto;
}

.main:focus-visible {
  outline: rem(2) solid var(--fs-color-black);
  outline-offset: rem(2);
}
</style>
