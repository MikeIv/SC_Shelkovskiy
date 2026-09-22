<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()

useSeoMeta({
  title: () => props.title ?? '',
})
</script>

<template>
  <div :class="$style.root">
    <div v-if="$slots.lead" :class="$style.lead">
      <slot name="lead" />
    </div>

    <h1 v-if="title" :class="$style.title">{{ title }}</h1>

    <div v-if="$slots.default" :class="$style.content">
      <slot />
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  overflow-x: clip;
  padding-top: var(--fs-space-4);
  padding-bottom: rem(80);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: var(--fs-space-5);
    padding-top: var(--fs-space-6);
    padding-bottom: rem(160);
  }
}

.lead {
  min-width: 0;
}

.title {
  @include fs-h1;
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  min-width: 0;
}
</style>
