<script setup lang="ts">
const props = defineProps<{
  title?: string
  /** Desktop: пустой хост справа от h1 (поиск каталога через Teleport). */
  withTitleAside?: boolean
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

    <div
      v-if="title || withTitleAside"
      :class="[$style.heading, withTitleAside ? $style.headingSplit : undefined]"
    >
      <h1 v-if="title" :class="$style.title">{{ title }}</h1>
      <div
        v-if="withTitleAside"
        :class="$style.titleAside"
        data-fs-title-aside
      />
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
  overflow-x: clip;
  padding-top: var(--fs-space-3);
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

.titleAside {
  display: none;
  min-width: 0;

  @include from-desktop {
    display: block;
    flex: 0 1 rem(504);
    width: rem(504);
    max-width: 100%;
  }
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
