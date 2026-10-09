<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()

/**
 * `title` объявляем только когда он передан: пустая строка перебивала заголовок,
 * который детальные страницы ставят сами (`LayoutInnerPage` без `title` + свой
 * `useSeoMeta` → тега `<title>` не было вовсе).
 */
if (props.title) {
  useSeoMeta({ title: () => props.title })
}
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
  gap: var(--fs-space-5);
  overflow-x: clip;
  padding-top: var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    padding-top: var(--fs-space-6);
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
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    gap: var(--fs-space-5);
  }
}
</style>
