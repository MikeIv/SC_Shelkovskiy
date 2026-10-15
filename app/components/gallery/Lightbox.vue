<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    images: string[]
    alt: string
    /** Набор ещё догружается: счётчик и стрелки раньше времени не показываем. */
    pending?: boolean
  }>(),
  { pending: false },
)

const emit = defineEmits<{
  close: []
}>()

const closeRef = ref<HTMLButtonElement | null>(null)
const currentIndex = ref(0)
const titleId = useId()

const total = computed(() => props.images.length)
const currentImage = computed(() => props.images[currentIndex.value] ?? '')
const canNavigate = computed(() => total.value > 1)
const navDisabled = computed(() => props.pending || !canNavigate.value)

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

  /** Пока набор догружается, стрелки клавиатуры ведут себя как кнопки: не листаем. */
  if (props.pending || !canNavigate.value) {
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
      :aria-busy="pending ? 'true' : undefined"
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
          :class="$style.arrowSide"
          direction="left"
          :disabled="navDisabled"
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
          :class="$style.arrowSide"
          direction="right"
          :disabled="navDisabled"
          @click="goNext"
        >
          Следующее фото
        </UiButtonArrow>
      </div>

      <div :class="$style.nav">
        <UiButtonArrow
          :class="$style.arrowNav"
          direction="left"
          :disabled="navDisabled"
          @click="goPrev"
        >
          Предыдущее фото
        </UiButtonArrow>

        <p
          v-if="total && !pending"
          :class="$style.counter"
          aria-live="polite"
        >
          <span>{{ currentIndex + 1 }}</span>
          <span :class="$style.counterTotal">/{{ total }}</span>
        </p>

        <UiButtonArrow
          :class="$style.arrowNav"
          direction="right"
          :disabled="navDisabled"
          @click="goNext"
        >
          Следующее фото
        </UiButtonArrow>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: rem(20) 0;
  background-color: var(--fs-color-white);

  @include from-desktop {
    gap: var(--fs-space-4);
    padding: rem(40);
  }
}

.close {
  position: absolute;
  top: rem(20);
  right: var(--fs-grid-margin);
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

  @include from-tablet {
    top: rem(24);
  }

  @include from-desktop {
    top: rem(28);
    right: rem(28);
  }

  &:focus-visible {
    border-radius: rem(2);
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
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
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: rem(1840);
  min-height: 0;

  @include from-desktop {
    display: grid;
    grid-template-columns: rem(100) minmax(0, 1fr) rem(100);
    gap: var(--fs-space-3);
  }
}

.arrowSide {
  display: none;

  @include from-desktop {
    display: inline-flex;
    justify-self: center;
  }
}

.arrowNav {
  @include from-desktop {
    display: none;
  }
}

.frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  max-height: 100%;

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

.nav {
  display: flex;
  flex-shrink: 0;
  gap: var(--fs-space-2);
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-inline: var(--fs-grid-margin);

  @include from-desktop {
    justify-content: center;
    padding-inline: 0;
  }
}

.counter {
  display: flex;
  gap: rem(4);
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
  border: 0;
  white-space: nowrap;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
