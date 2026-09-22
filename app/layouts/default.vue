<script setup lang="ts">
import { siteNavItems, type SiteNavPath } from '~/utils/siteNav'

const route = useRoute()

const headerOverlay = computed(() => Boolean(route.meta.headerOverlay))
const headerVariant = computed(() => (headerOverlay.value ? 'white' : 'black'))

function isSiteNavPath(path: string): path is SiteNavPath {
  return siteNavItems.some((item) => item.to === path)
}

/** Слева на разделах каталога, справа на их карточках. */
const patternSide = computed<'left' | 'right' | null>(() => {
  if (isSiteNavPath(route.path)) {
    return 'left'
  }

  const segments = route.path.split('/').filter(Boolean)
  const section = segments[0]

  if (segments.length === 2 && section && isSiteNavPath(`/${section}`)) {
    return 'right'
  }

  return null
})
</script>

<template>
  <div :class="$style.root">
    <LayoutHeader :variant="headerVariant" :overlay="headerOverlay" />
    <main id="content" :class="$style.main" tabindex="-1">
      <div
        v-if="patternSide"
        :class="$style.patternFrame"
        :data-side="patternSide"
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

/* Орнамент разделов: слева на каталоге, справа на карточке.
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
  --pattern-offset: #{rem(-80)};

  position: absolute;
  top: rem(8);
  left: var(--pattern-offset);
  width: rem(320);
  height: rem(320);
  background-color: var(--fs-color-beige);
  opacity: 0.2;
  mask: url('/images/home/categories/pattern.svg') center / contain no-repeat;

  @include from-tablet {
    --pattern-offset: #{rem(-420)};

    top: rem(-40);
    width: rem(800);
    height: rem(800);
  }

  @include from-desktop {
    --pattern-offset: #{rem(-560)};

    top: rem(-80);
    width: rem(1220);
    height: rem(1220);
  }
}

.patternFrame[data-side='right'] .pattern {
  right: var(--pattern-offset);
  left: auto;
}

.main:focus-visible {
  outline: rem(2) solid var(--fs-color-black);
  outline-offset: rem(2);
}
</style>
