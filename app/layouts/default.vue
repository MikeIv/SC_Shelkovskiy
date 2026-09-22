<script setup lang="ts">
import { siteNavItems } from '~/utils/siteNav'

const route = useRoute()

const headerOverlay = computed(() => Boolean(route.meta.headerOverlay))
const headerVariant = computed(() => (headerOverlay.value ? 'white' : 'black'))
const showNavPattern = computed(() =>
  siteNavItems.some((item) => item.to === route.path),
)
</script>

<template>
  <div :class="$style.root">
    <LayoutHeader :variant="headerVariant" :overlay="headerOverlay" />
    <main id="content" :class="$style.main" tabindex="-1">
      <div
        v-if="showNavPattern"
        :class="$style.patternFrame"
        aria-hidden="true"
      >
        <div :class="$style.pattern" />
      </div>
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
  /* Свой контекст: орнамент с z-index -1 остаётся под контентом и над фоном. */
  position: relative;
  z-index: 0;
  flex: 1 1 auto;
}

/* Орнамент каталога: левый верх страницы, как в Figma 528:11709.
   Кадр клипует выход за край и не создаёт горизонтальный скролл. */
.patternFrame {
  position: absolute;
  z-index: -1;
  top: rem(-80);
  left: 0;
  width: 100%;
  height: rem(400);
  overflow: hidden;
  pointer-events: none;

  @include from-tablet {
    top: rem(-100);
    height: rem(860);
  }

  @include from-desktop {
    top: rem(-160);
    height: rem(1280);
  }
}

.pattern {
  position: absolute;
  top: rem(8);
  left: rem(-80);
  width: rem(320);
  height: rem(320);
  background-color: var(--fs-color-beige);
  opacity: 0.2;
  mask: url('/images/home/categories/pattern.svg') center / contain no-repeat;

  @include from-tablet {
    top: rem(-40);
    left: rem(-420);
    width: rem(800);
    height: rem(800);
  }

  @include from-desktop {
    top: rem(-80);
    left: rem(-560);
    width: rem(1220);
    height: rem(1220);
  }
}

.main:focus-visible {
  outline: rem(2) solid var(--fs-color-black);
  outline-offset: rem(2);
}
</style>
