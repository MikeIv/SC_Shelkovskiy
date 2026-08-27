<script setup lang="ts">
const props = defineProps<{
  title: string
}>()

useSeoMeta({
  title: () => props.title,
})
</script>

<template>
  <div :class="$style.root">
    <h1>{{ title }}</h1>
    <slot />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  padding-block: var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    padding-block: var(--fs-space-6);
  }

  h1 {
    @include fs-h1;
    margin: 0;
  }
}
</style>
