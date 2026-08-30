<script setup lang="ts">
export type LayoutHeaderVariant = 'white' | 'black'

withDefaults(
  defineProps<{
    variant?: LayoutHeaderVariant
    overlay?: boolean
  }>(),
  {
    variant: 'black',
    overlay: false,
  },
)

const hoursLabel = 'Сегодня с 10:00 до 22:00'
</script>

<template>
  <header :class="$style.root" :data-variant="variant" :data-overlay="overlay || undefined">
    <a :class="$style.skip" href="#content">К содержанию</a>
    <div :class="$style.inner">
      <div :class="$style.bar">
        <div :class="$style.start">
          <button :class="[$style.iconBtn, $style.searchMobile]" type="button">
            <UIcon name="local:search" :class="$style.icon" aria-hidden="true" />
            <span :class="$style.srOnly">Поиск</span>
          </button>
          <div :class="$style.meta">
            <button :class="$style.hours" type="button">
              <span>{{ hoursLabel }}</span>
              <UIcon name="local:arrow-down" :class="$style.icon" aria-hidden="true" />
            </button>
            <a :class="$style.textLink" href="#" @click.prevent>Как добраться</a>
          </div>
        </div>
        <NuxtLink :class="$style.brand" to="/" aria-label="Щёлковский">
          <UiLogo :class="$style.logo" :variant="variant" aria-hidden="true" />
        </NuxtLink>
        <div :class="$style.end">
          <div :class="$style.endMain">
            <a :class="$style.action" href="#" @click.prevent>
              <span :class="$style.actionIcon">
                <UIcon name="local:map" :class="$style.icon" aria-hidden="true" />
              </span>
              <span :class="$style.actionLabel">Схема</span>
            </a>
            <button :class="[$style.action, $style.searchDesk]" type="button">
              <span :class="$style.actionIcon">
                <UIcon name="local:search" :class="$style.icon" aria-hidden="true" />
              </span>
              <span :class="$style.actionLabel">Поиск</span>
            </button>
          </div>
          <button :class="$style.iconBtn" type="button" aria-label="Меню">
            <UIcon name="local:menu" :class="$style.icon" aria-hidden="true" />
          </button>
        </div>
      </div>
      <nav :class="$style.nav" aria-label="Разделы">
        <ul :class="$style.navList">
          <li v-for="item in siteNavItems" :key="item.to">
            <NuxtLink
              :class="$style.navLink"
              :to="item.to"
              :active-class="$style.navLinkActive"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style module lang="scss">
@use 'tools' as *;

@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

@mixin hover-underline {
  border-bottom: rem(2) solid transparent;
  transition: border-color 0.2s ease;

  @media (hover: hover) {
    &:hover {
      border-bottom-color: var(--fs-color-beige);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.root {
  position: relative;
  z-index: z('header');
  padding-top: rem(20);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );
  border-bottom: rem(2) solid currentColor;
  color: var(--fs-color-black);

  &[data-variant='white'] {
    color: var(--fs-color-white);
  }

  &[data-overlay] {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
  }

  @include from-desktop {
    padding-top: 0;
    border-bottom: 0;
  }
}

.skip {
  position: absolute;
  top: var(--fs-space-2);
  left: var(--fs-grid-margin);
  z-index: z('default');
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;

  &:focus {
    width: auto;
    height: auto;
    padding: var(--fs-space-1) var(--fs-space-2);
    overflow: visible;
    clip-path: none;
    @include fs-text-lg;
    color: var(--fs-color-black);
    background-color: var(--fs-color-white);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: 0;
  }
}

.inner {
  display: flex;
  flex-direction: column;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--fs-space-2);

  @include from-desktop {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    min-height: rem(46);
    padding-bottom: 0;
  }
}

.start,
.end {
  display: flex;
  flex-shrink: 0;
  gap: var(--fs-space-1);
  align-items: center;
}

.start {
  @include from-desktop {
    grid-column: 1;
    justify-self: start;
  }
}

.end {
  @include from-desktop {
    grid-column: 3;
    gap: var(--fs-space-3);
    justify-self: end;
  }
}

.endMain {
  display: flex;
  gap: var(--fs-space-1);
  align-items: center;

  @include from-desktop {
    gap: var(--fs-space-6);
  }
}

.meta {
  display: none;

  @include from-desktop {
    display: flex;
    gap: var(--fs-space-4);
    align-items: center;
  }
}

.brand {
  flex-shrink: 0;

  @include from-desktop {
    grid-column: 2;
    justify-self: center;
  }

  &:focus-visible {
    outline: rem(2) solid currentColor;
    outline-offset: rem(2);
  }
}

.logo {
  @include from-desktop {
    width: clamp(#{rem(161)}, 18vw, #{rem(303)});
  }
}

.hours,
.textLink,
.action,
.iconBtn {
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid currentColor;
    outline-offset: rem(2);
  }
}

.hours,
.textLink {
  display: inline-flex;
  gap: var(--fs-space-1);
  align-items: center;
  @include fs-text-lg;
  white-space: nowrap;
}

.iconBtn {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
}

.action {
  display: inline-flex;
  flex-shrink: 0;
  gap: rem(12);
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);

  @include from-desktop {
    width: auto;
    height: auto;
    @include hover-underline;
    @include fs-text-lg;
    white-space: nowrap;
  }
}

.searchMobile {
  @include from-desktop {
    display: none;
  }
}

.searchDesk {
  display: none;

  @include from-desktop {
    display: inline-flex;
  }
}

.actionIcon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(24);
  height: rem(24);
  overflow: clip;
}

.actionLabel {
  @include visually-hidden;

  @include from-desktop {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip-path: none;
  }
}

.icon {
  display: block;
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
  overflow: clip;
}

.nav {
  display: none;

  @include from-desktop {
    display: block;
    padding-top: var(--fs-space-2);
    border-top: rem(2) solid currentColor;
  }
}

.navList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navLink {
  display: inline-flex;
  align-items: center;
  padding-block: rem(4);
  @include hover-underline;
  @include fs-text;
  white-space: nowrap;

  &:focus-visible {
    outline: rem(2) solid currentColor;
    outline-offset: rem(2);
  }
}

.navLinkActive {
  border-bottom-color: var(--fs-color-beige);
}

.srOnly {
  @include visually-hidden;
}
</style>
