<script setup lang="ts">
import type { EventRegisterPopup } from '#shared/types/events'

const props = defineProps<{
  open: boolean
  content: EventRegisterPopup
}>()

const emit = defineEmits<{
  close: []
}>()

const titleId = useId()
const closeRef = ref<HTMLButtonElement | null>(null)

let previousOverflow = ''
let previousFocus: HTMLElement | null = null

function close(): void {
  emit('close')
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function lockScroll(lock: boolean): void {
  if (!import.meta.client) {
    return
  }

  if (lock) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousOverflow
}

function bindKeydown(bind: boolean): void {
  if (!import.meta.client) {
    return
  }

  document.removeEventListener('keydown', onKeydown)

  if (bind) {
    document.addEventListener('keydown', onKeydown)
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!import.meta.client) {
      return
    }

    bindKeydown(isOpen)
    lockScroll(isOpen)

    if (!isOpen) {
      previousFocus?.focus()
      previousFocus = null
      return
    }

    previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    await nextTick()
    closeRef.value?.focus()
  },
)

onBeforeUnmount(() => {
  bindKeydown(false)
  lockScroll(false)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      :class="$style.root"
    >
      <div
        :class="$style.backdrop"
        aria-hidden="true"
        @click="close"
      />

      <div
        :class="$style.dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div :class="$style.panel">
          <button
            ref="closeRef"
            :class="$style.close"
            type="button"
            aria-label="Закрыть"
            @click="close"
          >
            <UIcon
              name="local:cross"
              :class="$style.closeIcon"
              aria-hidden="true"
            />
          </button>

          <div :class="$style.copy">
            <h2
              :id="titleId"
              :class="$style.title"
            >
              {{ content.title }}
            </h2>
            <p :class="$style.description">
              {{ content.description }}
            </p>
          </div>

          <UiButton :href="content.ctaHref">
            {{ content.ctaLabel }}
          </UiButton>
        </div>

        <div :class="$style.media">
          <img
            :class="$style.image"
            :src="content.imageSrc"
            :alt="content.imageAlt"
            width="619"
            height="306"
            decoding="async"
          >
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: fixed;
  inset: 0;
  z-index: z('modal');
  display: grid;
  place-items: center;
  padding: var(--fs-space-3) var(--fs-grid-margin);
  overflow: auto;
  overscroll-behavior: contain;
}

.backdrop {
  position: fixed;
  inset: 0;
  background-color: color-mix(in srgb, var(--fs-color-black) 55%, transparent);
}

.dialog {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  width: min(100%, #{rem(643)});
  margin-block: auto;
}

.panel,
.media {
  position: relative;
  width: 100%;
  overflow: clip;
  background-color: var(--fs-color-white);
  border-radius: rem(32);

  @include from-desktop {
    border-radius: rem(60);
  }
}

.panel {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: center;
  padding: var(--fs-space-4);

  @include from-desktop {
    padding: rem(56);
  }
}

.media {
  padding: rem(12);
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: center;
  width: 100%;
}

.title {
  @include fs-h2;
  margin: 0;
  text-align: center;
  overflow-wrap: break-word;
}

.description {
  max-width: rem(412);
  margin: 0;
  @include fs-text-lg;
  text-align: center;
  overflow-wrap: break-word;
}

.close {
  position: absolute;
  top: var(--fs-space-2);
  right: var(--fs-space-2);
  z-index: z('default');
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--fs-color-black);
  background-color: transparent;
  cursor: pointer;
  appearance: none;

  @include from-desktop {
    top: rem(32);
    right: rem(32);
    width: rem(24);
    height: rem(24);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
    border-radius: rem(2);
  }
}

.closeIcon {
  display: block;
  width: rem(24);
  height: rem(24);
}

.image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 619 / 306;
  object-fit: cover;
  object-position: center;
  border-radius: rem(24);

  @include from-desktop {
    border-radius: rem(60);
  }
}
</style>
