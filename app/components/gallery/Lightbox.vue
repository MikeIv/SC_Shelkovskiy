<script setup lang="ts">
const props = defineProps<{
  open: boolean
  images: string[]
  alt: string
}>()

const emit = defineEmits<{
  close: []
}>()

const closeRef = ref<HTMLButtonElement | null>(null)
const currentIndex = ref(0)
const titleId = useId()

const total = computed(() => props.images.length)
const currentImage = computed(() => props.images[currentIndex.value] ?? '')
const canNavigate = computed(() => total.value > 1)

let previousOverflow = ''
let previousFocus: HTMLElement | null = null

function close(): void {
  emit('close')
}

function goTo(index: number): void {
  if (!total.value) {
    return
  }

  currentIndex.value = ((index % total.value) + total.value) % total.value
}

function goPrev(): void {
  goTo(currentIndex.value - 1)
}

function goNext(): void {
  goTo(currentIndex.value + 1)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (!canNavigate.value) {
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goPrev()
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    goNext()
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

  if (bind) {
    document.addEventListener('keydown', onKeydown)
    return
  }

  document.removeEventListener('keydown', onKeydown)
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!import.meta.client) {
      return
    }

    bindKeydown(false)

    if (!isOpen) {
      lockScroll(false)
      previousFocus?.focus()
      previousFocus = null
      return
    }

    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    currentIndex.value = 0
    lockScroll(true)
    bindKeydown(true)
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
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <h2 :id="titleId" :class="$style.srOnly">
        Просмотр фото
      </h2>

      <button
        ref="closeRef"
        :class="$style.close"
        type="button"
        aria-label="Закрыть"
        @click="close"
      >
        <UIcon name="local:cross" :class="$style.closeIcon" aria-hidden="true" />
      </button>

      <div :class="$style.stage">
        <UiButtonArrow
          :class="$style.arrow"
          direction="left"
          :disabled="!canNavigate"
          @click="goPrev"
        >
          Предыдущее фото
        </UiButtonArrow>

        <div :class="$style.frame">
          <img
            v-if="currentImage"
            :key="`${currentImage}-${currentIndex}`"
            :class="$style.image"
            :src="currentImage"
            :alt="alt"
            width="1146"
            height="764"
            decoding="async"
          >
        </div>

        <UiButtonArrow
          :class="$style.arrow"
          direction="right"
          :disabled="!canNavigate"
          @click="goNext"
        >
          Следующее фото
        </UiButtonArrow>
      </div>

      <p
        v-if="total"
        :class="$style.counter"
        aria-live="polite"
      >
        <span>{{ currentIndex + 1 }}</span>
        <span :class="$style.counterTotal">/{{ total }}</span>
      </p>
    </div>
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: fixed;
  inset: 0;
  z-index: z('modal');
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--fs-space-3);
  padding: var(--fs-space-5) var(--fs-grid-margin);
  background-color: var(--fs-color-white);

  @include from-desktop {
    gap: var(--fs-space-4);
    padding: rem(40);
  }
}

.close {
  position: absolute;
  top: var(--fs-space-2);
  right: var(--fs-space-2);
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
  transition: color 0.2s ease;

  @include from-desktop {
    top: rem(28);
    right: rem(28);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
    border-radius: rem(2);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--fs-color-beige);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.closeIcon {
  width: rem(24);
  height: rem(24);
}

.stage {
  display: grid;
  grid-template-columns: rem(44) minmax(0, 1fr) rem(44);
  gap: var(--fs-space-1);
  align-items: center;
  width: 100%;
  max-width: rem(1840);
  min-height: 0;

  @include from-tablet {
    grid-template-columns: rem(80) minmax(0, 1fr) rem(80);
    gap: var(--fs-space-2);
  }

  @include from-desktop {
    grid-template-columns: rem(100) minmax(0, 1fr) rem(100);
    gap: var(--fs-space-3);
  }
}

.arrow {
  justify-self: center;
}

.frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  max-height: calc(100vh - rem(160));

  @include from-desktop {
    max-height: calc(100vh - rem(200));
  }
}

.image {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: inherit;
  object-fit: contain;
}

.counter {
  display: flex;
  gap: var(--fs-space-1);
  align-items: center;
  margin: 0;
  @include fs-h4;
  color: var(--fs-color-black);
}

.counterTotal {
  color: var(--fs-color-gray);
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
