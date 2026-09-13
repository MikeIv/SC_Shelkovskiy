<script setup lang="ts">
const DESKTOP_MQ = '(min-width: 1280px)'

const props = defineProps<{
  open: boolean
  anchor: HTMLElement | null
  hoursOpen?: boolean
  hoursLabel?: string
}>()

const emit = defineEmits<{
  close: []
  'toggle-hours': []
  search: []
}>()

const contactsTitleId = useId()
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

const mobileSecondary = [
  ...menuNavSecondary,
  { label: 'Контакты', to: '/contacts' },
] as const

const addressLine = 'Москва, Щёлковское шоссе, 75'

function isDesktopViewport(): boolean {
  return window.matchMedia(DESKTOP_MQ).matches
}

function close(): void {
  emit('close')
}

function updatePosition(): void {
  if (!import.meta.client || !props.anchor) {
    return
  }

  if (!isDesktopViewport()) {
    panelStyle.value = {}
    return
  }

  const rect = props.anchor.getBoundingClientRect()
  panelStyle.value = {
    top: `${Math.round(rect.bottom + 16)}px`,
  }
}

function onDocumentPointerDown(event: Event): void {
  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (panelRef.value?.contains(target) || props.anchor?.contains(target)) {
    return
  }

  // На mobile меню на весь экран — закрытие только крестиком / Esc.
  if (!isDesktopViewport()) {
    return
  }

  close()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') {
    return
  }

  event.preventDefault()

  // Сначала закрываем часы, затем меню.
  if (props.hoursOpen) {
    emit('toggle-hours')
    return
  }

  close()
}

function setScrollLock(lock: boolean): void {
  if (!import.meta.client) {
    return
  }

  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

function bindListeners(bind: boolean): void {
  if (!import.meta.client) {
    return
  }

  if (bind) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    document.addEventListener('keydown', onKeydown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
}

watch(
  () => [props.open, props.anchor] as const,
  async ([isOpen]) => {
    if (!import.meta.client) {
      return
    }

    bindListeners(false)
    setScrollLock(false)

    if (!isOpen) {
      return
    }

    updatePosition()
    bindListeners(true)
    setScrollLock(!isDesktopViewport())
    await nextTick()
    updatePosition()
  },
)

onBeforeUnmount(() => {
  bindListeners(false)
  setScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <LayoutPopupBackdrop :class="$style.backdrop" @close="close" />
      <div
        ref="panelRef"
        :class="[$style.panel, hoursOpen && $style.panelHoursOpen]"
        :style="panelStyle"
        role="dialog"
        aria-label="Меню"
      >
        <div :class="$style.chrome">
          <div :class="$style.bar">
            <button
              :class="$style.iconBtn"
              type="button"
              aria-label="Поиск"
              @click="emit('search')"
            >
              <UIcon name="local:search" :class="$style.barIcon" aria-hidden="true" />
            </button>

            <NuxtLink
              :class="$style.brand"
              to="/"
              aria-label="Щёлковский"
              @click="close"
            >
              <UiLogo :class="$style.logo" variant="black" aria-hidden="true" />
            </NuxtLink>

            <div :class="$style.barEnd">
              <NuxtLink
                :class="$style.iconBtn"
                to="/map"
                aria-label="Схема"
                @click="close"
              >
                <UIcon name="local:map" :class="$style.barIcon" aria-hidden="true" />
              </NuxtLink>
              <button
                :class="$style.iconBtn"
                type="button"
                aria-label="Закрыть меню"
                @click="close"
              >
                <UIcon name="local:cross" :class="$style.barIcon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div :class="$style.chromeBody">
            <div :class="$style.quick">
              <NuxtLink :class="$style.quickLink" to="/map" @click="close">
                <UIcon name="local:map" :class="$style.quickIcon" aria-hidden="true" />
                Схема
              </NuxtLink>
              <NuxtLink :class="$style.quickLink" to="/directions" @click="close">
                <UIcon name="local:car" :class="$style.quickIcon" aria-hidden="true" />
                Как добраться
              </NuxtLink>
            </div>

            <button
              :class="$style.hours"
              type="button"
              aria-haspopup="dialog"
              :aria-expanded="hoursOpen || undefined"
              @click="emit('toggle-hours')"
            >
              <span>{{ hoursLabel }}</span>
              <UIcon name="local:arrow-down" :class="$style.hoursIcon" aria-hidden="true" />
            </button>

            <LayoutHoursPanel
              v-if="hoursOpen"
              :class="$style.hoursPanel"
              variant="embedded"
            />
          </div>
        </div>

        <div
          v-if="hoursOpen"
          :class="$style.hoursOverlay"
          aria-hidden="true"
          @click="emit('toggle-hours')"
        />

        <nav :class="$style.primary" aria-label="Разделы">
          <ul :class="$style.linkList">
            <li v-for="item in siteNavItems" :key="item.to">
              <NuxtLink
                :class="[$style.link, $style.linkPrimary]"
                :to="item.to"
                :active-class="$style.linkActive"
                @click="close"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div :class="$style.divider" aria-hidden="true" />

        <div :class="$style.media" aria-hidden="true">
          <img
            :class="$style.mediaImg"
            src="/images/layout/menu-mall.jpg"
            alt=""
            width="338"
            height="338"
            decoding="async"
          >
        </div>

        <nav :class="$style.secondary" aria-label="О центре">
          <ul :class="$style.linkList">
            <li
              v-for="item in mobileSecondary"
              :key="item.to"
              :class="$style.secondaryItem"
            >
              <NuxtLink
                :class="[$style.link, $style.linkSecondary]"
                :to="item.to"
                :active-class="$style.linkActive"
                @click="close"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div :class="$style.divider" aria-hidden="true" />

        <section :class="$style.contacts" :aria-labelledby="contactsTitleId">
          <NuxtLink
            :id="contactsTitleId"
            :class="[$style.link, $style.linkPrimary, $style.contactsTitle]"
            to="/contacts"
            :active-class="$style.linkActive"
            @click="close"
          >
            Контакты
          </NuxtLink>
          <div :class="$style.contactsBody">
            <p :class="$style.address">
              <span :class="$style.addressMobile">{{ addressLine }}</span>
              <span :class="$style.addressDesk">
                Москва,<br>
                Щёлковское шоссе, 75
              </span>
            </p>
            <a :class="$style.contactLink" :href="footerContacts.phoneHref">
              {{ footerContacts.phone }}
            </a>
            <a :class="$style.contactLink" :href="footerContacts.emailHref">
              {{ footerContacts.email }}
            </a>
            <ul :class="$style.socialList">
              <li v-for="item in footerSocialLinks" :key="item.label">
                <a
                  :class="$style.socialLink"
                  :href="item.href"
                  :aria-label="item.label"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img
                    :class="$style.socialIcon"
                    :src="item.icon"
                    alt=""
                    width="44"
                    height="44"
                  >
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </template>
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.backdrop {
  display: none;

  @include from-tablet {
    display: block;
    /* Строго ниже header — не перекрываем схему/крестик. */
    top: var(--fs-menu-header-offset, #{rem(80)});
    background-color: color-mix(in srgb, var(--fs-color-black) 55%, transparent);
  }

  @include from-desktop {
    top: 0;
  }
}

.panel {
  position: fixed;
  inset: 0;
  z-index: z('dropdown-panel');
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: none;
  padding: 0;
  overflow: auto;
  border-radius: 0;
  color: var(--fs-color-black);
  background-color: var(--fs-color-white);
  box-shadow: none;

  /*
   * Tablet: drawer справа НИЖЕ header (не top:0).
   * Иначе панель перекрывает «Схему» и крестик независимо от z-index.
   */
  @include from-tablet {
    inset: auto;
    top: var(--fs-menu-header-offset, #{rem(80)});
    right: 0;
    bottom: 0;
    width: rem(375);
  }

  @include from-desktop {
    inset: auto;
    top: auto;
    right: max(
      var(--fs-grid-margin),
      calc((100% - var(--fs-grid-content-max)) / 2)
    );
    bottom: auto;
    left: max(
      var(--fs-grid-margin),
      calc((100% - var(--fs-grid-content-max)) / 2)
    );
    display: grid;
    grid-template-columns: auto rem(338) auto minmax(#{rem(260)}, 1fr);
    gap: var(--fs-space-5) rem(70);
    align-items: start;
    width: auto;
    max-height: calc(100vh - #{rem(24)});
    padding: var(--fs-space-5) rem(80);
    border-radius: rem(60);
  }
}

.panelHoursOpen {
  /* Не скроллим всё меню: beige chrome по контенту, низ затемнён overlay. */
  overflow: hidden;

  .chrome {
    /* Иначе flex сжимает chrome под nav → внутренний скролл и «обрезанный» popup. */
    flex-shrink: 0;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .primary,
  .secondary,
  .contacts,
  .divider {
    pointer-events: none;
  }
}

.chrome {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  padding-top: rem(20);
  padding-bottom: var(--fs-space-4);
  background-color: var(--fs-color-light);
  border-end-start-radius: rem(32);
  border-end-end-radius: rem(32);

  /* Без внутреннего хедера — он в LayoutHeader (tablet). */
  @include from-tablet {
    padding-top: var(--fs-space-4);
  }

  @include from-desktop {
    display: none;
  }
}

.hoursOverlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: color-mix(in srgb, var(--fs-color-black) 55%, transparent);
  cursor: pointer;

  @include from-desktop {
    display: none;
  }
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--fs-grid-margin);
  padding-bottom: var(--fs-space-2);

  @include from-tablet {
    display: none;
  }
}

.barEnd {
  display: flex;
  flex-shrink: 0;
  gap: var(--fs-space-1);
  align-items: center;
}

.iconBtn {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  background: none;
  cursor: pointer;
  appearance: none;
  text-decoration: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.barIcon,
.quickIcon {
  display: block;
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}

.brand {
  flex-shrink: 0;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.logo {
  width: rem(161);
}

.chromeBody {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  padding-inline: var(--fs-grid-margin);
}

.quick {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--fs-space-2);
  align-items: center;
}

.quickLink {
  display: inline-flex;
  gap: rem(12);
  align-items: center;
  @include fs-text;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.hours {
  display: flex;
  gap: var(--fs-space-1);
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: rem(10) 0;
  border: 0;
  @include fs-text;
  color: inherit;
  background: none;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  &[aria-expanded='true'] .hoursIcon {
    transform: rotate(180deg);
  }
}

.hoursIcon {
  display: block;
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
  transition: transform 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.hoursPanel {
  width: 100%;
}

.primary,
.secondary,
.contacts {
  min-width: 0;
}

.primary {
  padding: var(--fs-space-4) var(--fs-grid-margin) 0;

  @include from-desktop {
    padding: 0;
  }
}

.secondary {
  padding: var(--fs-space-4) var(--fs-grid-margin) 0;

  @include from-desktop {
    padding: 0;
  }
}

.divider {
  width: 100%;
  height: 0;
  margin-top: var(--fs-space-4);
  border: 0;
  border-top: rem(2) solid var(--fs-color-black);

  @include from-desktop {
    display: none;
  }
}

.linkList {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  margin: 0;
  padding: 0;
  list-style: none;

  .secondary & {
    gap: var(--fs-space-2);
  }

  @include from-desktop {
    gap: rem(4);

    .secondary & {
      gap: rem(4);
    }
  }
}

.secondaryItem {
  &:last-child {
    @include from-desktop {
      display: none;
    }
  }
}

.link {
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s ease;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.linkPrimary {
  padding-block: rem(12) rem(4);
  border-bottom: rem(2) solid transparent;
  @include fs-h3;

  @include from-desktop {
    padding-block: rem(16) rem(4);
    white-space: nowrap;
  }

  @media (hover: hover) {
    &:hover {
      border-bottom-color: var(--fs-color-black);
    }
  }
}

.linkSecondary {
  @include fs-text-md;
  border-bottom: rem(2) solid transparent;

  @include from-desktop {
    padding-block: rem(16) rem(4);
    @include fs-h3;
    white-space: nowrap;
  }

  @media (hover: hover) {
    &:hover {
      border-bottom-color: var(--fs-color-black);
    }
  }
}

.linkActive {
  border-bottom-color: var(--fs-color-black);
}

.media {
  display: none;
  flex-shrink: 0;
  width: rem(220);
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 50%;

  @include from-desktop {
    display: block;
    width: rem(338);
    align-self: start;
  }
}

.mediaImg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.contacts {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  padding: var(--fs-space-4) var(--fs-grid-margin) var(--fs-space-5);

  @include from-desktop {
    padding: 0;
  }
}

.contactsTitle {
  display: none;
  align-self: flex-start;

  @include from-desktop {
    display: inline-flex;
  }
}

.contactsBody {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);

  @include from-desktop {
    gap: var(--fs-space-3);
    margin-top: rem(12);
  }
}

.address,
.contactLink {
  margin: 0;
  @include fs-text;
  color: inherit;

  @include from-desktop {
    @include fs-h4;
    font-weight: 400;
  }
}

.addressMobile {
  @include from-desktop {
    display: none;
  }
}

.addressDesk {
  display: none;

  @include from-desktop {
    display: inline;
  }
}

.contactLink {
  text-decoration: none;
  word-break: break-word;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
      text-underline-offset: rem(2);
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.socialList {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2);
  margin: var(--fs-space-2) 0 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    margin-top: 0;
  }
}

.socialLink {
  display: block;
  flex-shrink: 0;
  border-radius: 50%;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.socialIcon {
  display: block;
  width: rem(44);
  height: rem(44);
}
</style>
