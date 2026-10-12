<script setup lang="ts">
import { siteNavItems, type SiteNavPath } from '~/utils/siteNav'

const route = useRoute()

const headerOverlay = computed(() => Boolean(route.meta.headerOverlay))
const headerVariant = computed(() => (headerOverlay.value ? 'white' : 'black'))

function isSiteNavPath(path: string): path is SiteNavPath {
  return siteNavItems.some((item) => item.to === path)
}

/** Слева на разделах каталога, справа на их карточках; meta.patternSide — override. */
const patternSide = computed<'left' | 'right' | null>(() => {
  const metaSide = route.meta.patternSide
  if (metaSide === 'left' || metaSide === 'right') {
    return metaSide
  }

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
    <UiDemoDataNotice />
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
  padding-bottom: var(--fs-space-section);
}

/* Орнамент разделов: Mob — крупный, смещён влево (Figma −194 / 374);
   tablet+ — по центру вьюпорта. Кадр клипует выход за край. */
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
    height: rem(1400);
  }
}

.pattern {
  position: absolute;
  top: 0;
  left: rem(-194);
  width: rem(374);
  height: rem(373);
  background-color: var(--fs-color-ornament);
  mask: url('/images/home/categories/pattern.svg') center / contain no-repeat;

  @include from-tablet {
    top: 0;
    left: 50%;
    width: rem(725);
    height: rem(723);
    transform: translateX(-50%);
  }

  @include from-desktop {
    width: rem(1348);
    height: rem(1344);
  }
}

.patternFrame[data-side='right'] .pattern {
  right: rem(-194);
  left: auto;

  @include from-tablet {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
}

.main:focus-visible {
  outline: rem(2) solid var(--fs-color-black);
  outline-offset: rem(2);
}
</style>
