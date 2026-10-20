<script setup lang="ts">
const props = defineProps<{
  title?: string
  /**
   * `seoTitle` — `<title>` из CMS, когда он отличается от `<h1>`. H1 остаётся `title`:
   * заголовок в шапке страницы рисуется из контента, а не из SEO-поля.
   */
  seoTitle?: string
}>()

/**
 * `title` объявляем только когда он передан: пустая строка перебивала заголовок,
 * который детальные страницы ставят сами (`LayoutInnerPage` без `title` + свой
 * `useSeoMeta` → тега `<title>` не было вовсе).
 */
if (props.title) {
  useSeoMeta({ title: () => props.seoTitle || props.title })
}
</script>

<template>
  <div :class="$style.root">
    <div v-if="$slots.lead" :class="$style.lead">
      <slot name="lead" />
    </div>

    <div
      v-if="title || $slots['title-aside']"
      :class="[$style.heading, $slots['title-aside'] ? $style.headingSplit : undefined]"
    >
      <h1 v-if="title" :class="$style.title">{{ title }}</h1>
      <div v-if="$slots['title-aside']" class="fs-catalog-search-aside">
        <slot name="title-aside" />
      </div>
    </div>

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
  padding-top: var(--fs-space-3);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );
  overflow-x: clip;

  @include from-desktop {
    padding-top: var(--fs-space-6);
  }
}

.lead {
  min-width: 0;
}

.heading {
  min-width: 0;
}

.headingSplit {
  @include from-desktop {
    display: flex;
    gap: var(--fs-space-3);
    align-items: center;
    justify-content: space-between;
  }
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
