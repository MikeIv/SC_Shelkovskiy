<script setup lang="ts">
import { mallHoursTodayLabel } from '~/data/mallHours'

export type LayoutHeaderVariant = 'white' | 'black'

const props = withDefaults(
  defineProps<{
    variant?: LayoutHeaderVariant
    overlay?: boolean
  }>(),
  {
    variant: 'black',
    overlay: false,
  },
)

const hoursLabel = computed(() => mallHoursTodayLabel())
const hoursOpen = ref(false)
const hoursBtnRef = ref<HTMLButtonElement | null>(null)
const menuOpen = ref(false)
const menuBtnRef = ref<HTMLButtonElement | null>(null)
const searchOpen = ref(false)

const popupOpen = computed(
  () => hoursOpen.value || menuOpen.value || searchOpen.value,
)
const { pinned, hidden } = useHeaderScroll({
  pauseHide: popupOpen,
})

const visualVariant = computed<LayoutHeaderVariant>(() =>
  pinned.value || menuOpen.value ? 'black' : props.variant,
)

const headerRef = ref<HTMLElement | null>(null)
const spacerHeight = ref(0)
const MENU_HEADER_OFFSET_VAR = '--fs-menu-header-offset'
let measureTimer = 0

function measureHeaderHeight(): number {
  if (!headerRef.value) {
    return 80
  }

  return Math.round(headerRef.value.getBoundingClientRect().height) || 80
}

function syncMenuHeaderOffset(): void {
  if (!import.meta.client) {
    return
  }

  if (!menuOpen.value) {
    document.documentElement.style.removeProperty(MENU_HEADER_OFFSET_VAR)
    return
  }

  document.documentElement.style.setProperty(
    MENU_HEADER_OFFSET_VAR,
    `${measureHeaderHeight()}px`,
  )
}

function measureSpacer(): void {
  if (!import.meta.client || !headerRef.value || props.overlay) {
    spacerHeight.value = 0
    syncMenuHeaderOffset()
    return
  }

  // fixed: pinned scroll или tablet-меню — нужен spacer в потоке.
  if (!pinned.value && !menuOpen.value) {
    spacerHeight.value = 0
    syncMenuHeaderOffset()
    return
  }

  spacerHeight.value = measureHeaderHeight()
  syncMenuHeaderOffset()
}

function scheduleMeasureSpacer(): void {
  if (!import.meta.client) {
    return
  }

  window.clearTimeout(measureTimer)
  void nextTick(() => {
    measureSpacer()
    measureTimer = window.setTimeout(measureSpacer, 320)
  })
}

function toggleHours(): void {
  menuOpen.value = false
  searchOpen.value = false
  hoursOpen.value = !hoursOpen.value
}

function toggleHoursFromMenu(): void {
  searchOpen.value = false
  hoursOpen.value = !hoursOpen.value
}

function closeHours(): void {
  hoursOpen.value = false
}

function toggleMenu(): void {
  hoursOpen.value = false
  searchOpen.value = false
  menuOpen.value = !menuOpen.value
}

function closeMenu(): void {
  hoursOpen.value = false
  menuOpen.value = false
}

function toggleSearch(): void {
  hoursOpen.value = false
  menuOpen.value = false
  searchOpen.value = !searchOpen.value
}

function closeSearch(): void {
  searchOpen.value = false
}

watch(pinned, scheduleMeasureSpacer)
watch(menuOpen, scheduleMeasureSpacer)

onMounted(() => {
  scheduleMeasureSpacer()
  window.addEventListener('resize', measureSpacer, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureSpacer)
  window.clearTimeout(measureTimer)
  if (import.meta.client) {
    document.documentElement.style.removeProperty(MENU_HEADER_OFFSET_VAR)
  }
})
</script>

<template>
  <div :class="$style.shell" :data-menu-open="menuOpen || undefined">
    <div
      v-show="!overlay && (pinned || menuOpen)"
      :class="$style.spacer"
      :style="{ height: `${spacerHeight}px` }"
      aria-hidden="true"
    />
    <header
      ref="headerRef"
      :class="$style.root"
      :data-variant="visualVariant"
      :data-overlay="overlay || undefined"
      :data-pinned="pinned || undefined"
      :data-menu-open="menuOpen || undefined"
      :data-hidden="hidden || undefined"
      :aria-hidden="hidden && !menuOpen ? true : undefined"
      :inert="hidden && !menuOpen"
    >
      <a :class="$style.skip" href="#content">К содержанию</a>
      <div :class="$style.inner">
        <div :class="$style.bar">
          <div :class="$style.start">
            <button
              :class="[$style.iconBtn, $style.searchMobile]"
              type="button"
              aria-haspopup="dialog"
              :aria-expanded="searchOpen"
              @click="toggleSearch"
            >
              <UIcon name="local:search" :class="$style.icon" aria-hidden="true" />
              <span :class="$style.srOnly">Поиск</span>
            </button>
            <div :class="$style.meta">
              <button
                ref="hoursBtnRef"
                :class="$style.hours"
                type="button"
                aria-haspopup="dialog"
                :aria-expanded="hoursOpen"
                @click="toggleHours"
              >
                <span>{{ hoursLabel }}</span>
                <UIcon name="local:arrow-down" :class="$style.icon" aria-hidden="true" />
              </button>
              <NuxtLink :class="$style.textLink" to="/directions">
                Как добраться
              </NuxtLink>
            </div>
          </div>
          <NuxtLink :class="$style.brand" to="/" aria-label="Щёлковский">
            <UiLogo :class="$style.logo" :variant="visualVariant" aria-hidden="true" />
          </NuxtLink>
          <div :class="$style.end">
            <div :class="$style.endMain">
              <NuxtLink :class="$style.action" to="/map">
                <span :class="$style.actionIcon">
                  <UIcon name="local:map" :class="$style.icon" aria-hidden="true" />
                </span>
                <span :class="$style.actionLabel">Схема</span>
              </NuxtLink>
              <button
                :class="[$style.action, $style.searchDesk]"
                type="button"
                aria-haspopup="dialog"
                :aria-expanded="searchOpen"
                @click="toggleSearch"
              >
                <span :class="$style.actionIcon">
                  <UIcon name="local:search" :class="$style.icon" aria-hidden="true" />
                </span>
                <span :class="$style.actionLabel">Поиск</span>
              </button>
            </div>
            <button
              ref="menuBtnRef"
              :class="$style.iconBtn"
              type="button"
              :aria-label="menuOpen ? 'Закрыть меню' : 'Меню'"
              aria-haspopup="dialog"
              :aria-expanded="menuOpen"
              @click="toggleMenu"
            >
              <UIcon
                :name="menuOpen ? 'local:cross' : 'local:menu'"
                :class="$style.icon"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <nav
          :class="$style.nav"
          aria-label="Разделы"
          :aria-hidden="pinned ? true : undefined"
          :inert="pinned"
        >
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
      <LazyLayoutMenuModal
        :open="menuOpen"
        :anchor="menuBtnRef"
        :hours-open="hoursOpen"
        :hours-label="hoursLabel"
        @close="closeMenu"
        @toggle-hours="toggleHoursFromMenu"
        @search="toggleSearch"
      />
      <LazyLayoutHoursModal
        :open="hoursOpen && !menuOpen"
        :anchor="hoursBtnRef"
        @close="closeHours"
      />
      <LazyLayoutSearchModal
        :open="searchOpen"
        @close="closeSearch"
      />
    </header>
  </div>
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

.shell {
  position: relative;
  z-index: z('header');

  /*
   * Важно: Teleport (меню/overlay) — sibling на body.
   * z-index на .root внутри shell не конкурирует с панелью —
   * поднимаем весь shell, иначе hoursOverlay/drawer перекрывают
   * «Схему» и крестик.
   */
  &[data-menu-open] {
    @include from-tablet {
      z-index: z('header-elevated');
    }

    @include from-desktop {
      z-index: z('header');
    }
  }
}

.spacer {
  flex-shrink: 0;
  pointer-events: none;
}

.root {
  position: relative;
  padding-top: rem(20);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );
  border-bottom: rem(2) solid currentColor;
  color: var(--fs-color-black);
  transition:
    transform 0.35s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease,
    border-radius 0.25s ease,
    padding 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;

  &[data-variant='white'] {
    color: var(--fs-color-white);
  }

  &[data-overlay]:not([data-pinned]):not([data-menu-open]) {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
  }

  &[data-pinned] {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    padding-top: rem(24);
    padding-bottom: rem(24);
    border-bottom-color: transparent;
    border-bottom-right-radius: rem(32);
    border-bottom-left-radius: rem(32);
    color: var(--fs-color-black);
    background-color: var(--fs-color-white);
    box-shadow: 0 #{rem(8)} #{rem(40)} rgb(172 172 172 / 25%);
  }

  &[data-hidden]:not([data-menu-open]) {
    pointer-events: none;
    transform: translateY(-100%);
  }

  /* Tablet menu: fixed бар без полосы, единый блок с drawer. */
  &[data-menu-open] {
    @include from-tablet {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      width: 100%;
      border-bottom-color: transparent;
      border-radius: 0;
      color: var(--fs-color-black);
      background-color: var(--fs-color-white);
      box-shadow: none;
    }
  }

  @include from-desktop {
    padding-top: rem(40);
    border-bottom: 0;

    &[data-pinned] {
      padding-top: rem(24);
      padding-bottom: rem(24);
    }

    &[data-menu-open] {
      border-radius: inherit;
      color: inherit;
      background-color: transparent;
      box-shadow: inherit;
    }

    &[data-menu-open]:not([data-pinned]):not([data-overlay]) {
      position: relative;
    }

    &[data-menu-open][data-overlay]:not([data-pinned]) {
      position: absolute;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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

  .root[data-pinned] & {
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

.hours {
  .icon {
    transition: transform 0.2s ease;
  }

  &[aria-expanded='true'] .icon {
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .icon {
      transition: none;
    }
  }
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
    max-height: rem(72);
    padding-top: var(--fs-space-2);
    overflow: hidden;
    border-top: rem(2) solid currentColor;
    opacity: 1;
    transition:
      max-height 0.3s ease,
      opacity 0.2s ease,
      padding 0.3s ease,
      border-color 0.25s ease;
  }

  .root[data-pinned] & {
    max-height: 0;
    padding-top: 0;
    border-top-color: transparent;
    opacity: 0;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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
