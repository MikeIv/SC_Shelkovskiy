<script setup lang="ts">
const props = defineProps<{
  open: boolean
  anchor: HTMLElement | null
}>()

const emit = defineEmits<{
  close: []
}>()

const contactsTitleId = useId()
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

function close(): void {
  emit('close')
}

function updatePosition(): void {
  if (!import.meta.client || !props.anchor) {
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

  close()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
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

    if (!isOpen) {
      return
    }

    updatePosition()
    bindListeners(true)
    await nextTick()
    updatePosition()
  },
)

onBeforeUnmount(() => {
  bindListeners(false)
})
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <LayoutPopupBackdrop @close="close" />
      <div
        ref="panelRef"
        :class="$style.panel"
        :style="panelStyle"
        role="dialog"
        aria-label="Меню"
      >
        <nav :class="$style.primary" aria-label="Разделы">
          <ul :class="$style.linkList">
            <li v-for="item in siteNavItems" :key="item.to">
              <NuxtLink
                :class="$style.link"
                :to="item.to"
                :active-class="$style.linkActive"
                @click="close"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

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
            <li v-for="item in menuNavSecondary" :key="item.to">
              <NuxtLink
                :class="$style.link"
                :to="item.to"
                :active-class="$style.linkActive"
                @click="close"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <section :class="$style.contacts" :aria-labelledby="contactsTitleId">
          <NuxtLink
            :id="contactsTitleId"
            :class="[$style.link, $style.contactsTitle]"
            to="/contacts"
            :active-class="$style.linkActive"
            @click="close"
          >
            Контакты
          </NuxtLink>
          <div :class="$style.contactsBody">
            <p :class="$style.address">
              Москва,<br>
              Щёлковское шоссе, 75
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

.panel {
  position: fixed;
  right: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );
  left: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );
  z-index: z('dropdown-panel');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  max-height: calc(100vh - #{rem(24)});
  padding: var(--fs-space-3);
  overflow: auto;
  border-radius: rem(32);
  color: var(--fs-color-black);
  background-color: var(--fs-color-white);

  @include from-desktop {
    display: grid;
    grid-template-columns: auto rem(338) auto minmax(#{rem(260)}, 1fr);
    gap: var(--fs-space-5) rem(70);
    align-items: start;
    padding: var(--fs-space-5) rem(80);
    border-radius: rem(60);
  }
}

.primary,
.secondary,
.contacts {
  min-width: 0;
}

.linkList {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.link {
  display: inline-flex;
  align-items: center;
  padding-block: rem(16) rem(4);
  border-bottom: rem(2) solid transparent;
  @include fs-h3;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s ease;

  @include from-desktop {
    white-space: nowrap;
  }

  @media (hover: hover) {
    &:hover {
      border-bottom-color: var(--fs-color-black);
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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

  @include from-tablet {
    display: block;
    align-self: center;
  }

  @include from-desktop {
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
}

.contactsTitle {
  align-self: flex-start;
}

.contactsBody {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  margin-top: rem(12);
}

.address,
.contactLink {
  margin: 0;
  @include fs-h4;
  font-weight: 400;
  color: inherit;
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
  margin: 0;
  padding: 0;
  list-style: none;
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
