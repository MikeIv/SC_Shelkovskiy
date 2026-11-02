<script setup lang="ts">
import { createStaticVNode } from 'vue'
import logoSource from '~/assets/images/logo.svg?raw'

export type UiLogoVariant = 'white' | 'black'

withDefaults(
  defineProps<{
    variant?: UiLogoVariant
  }>(),
  {
    variant: 'black',
  },
)

const logoNode = createStaticVNode(
  logoSource
    .trim()
    .replace(/>\s+</g, '><')
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" '),
  1,
)
</script>

<template>
  <span
    :class="$style.root"
    :data-variant="variant"
    role="img"
    aria-label="Щёлковский"
  >
    <component :is="logoNode" />
  </span>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: inline-flex;
  flex-shrink: 0;
  width: rem(161);
  aspect-ratio: 303 / 46;
  color: var(--fs-color-black);

  &[data-variant='white'] {
    color: var(--fs-color-white);
  }

  @include from-desktop {
    width: rem(303);
  }

  /*
   * Селектор потомка без `:deep()`: в `<style module>` псевдо-класс `:deep()` не обрабатывается
   * (он из scoped-CSS) и правило отбрасывается целиком — SVG оставался со своей высотой 46px.
   * Дальше коробка с `aspect-ratio` (24.4px) в WebKit обрезала его снизу, а Chrome растягивался
   * под SVG и дефект прятал. `overflow: clip` убран: при совпадающих размерах он не нужен,
   * а при расхождении молча срезает логотип вместо заметного переполнения.
   */
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
