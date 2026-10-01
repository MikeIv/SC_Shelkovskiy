<script setup lang="ts">
const props = defineProps<{
  images: string[]
  alt: string
}>()

const currentIndex = ref(0)

const currentImage = computed(() => props.images[currentIndex.value] ?? '')
const total = computed(() => props.images.length)

function goTo(index: number) {
  if (!props.images.length) {
    return
  }

  const normalized = ((index % props.images.length) + props.images.length) % props.images.length
  currentIndex.value = normalized
}

function goPrev() {
  goTo(currentIndex.value - 1)
}

function goNext() {
  goTo(currentIndex.value + 1)
}
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.viewport">
      <img
        v-if="currentImage"
        :class="$style.image"
        :src="currentImage"
        :alt="alt"
      >
      <div v-else :class="$style.placeholder" aria-hidden="true">
        <UiLogo :class="$style.placeholderLogo" />
      </div>
    </div>

    <div v-if="total > 1" :class="$style.controls">
      <UiButtonArrow direction="left" @click="goPrev">
        Предыдущее фото
      </UiButtonArrow>

      <p :class="$style.counter" aria-live="polite">
        <span>{{ currentIndex + 1 }}</span>
        <span :class="$style.counterTotal">/{{ total }}</span>
      </p>

      <UiButtonArrow direction="right" @click="goNext">
        Следующее фото
      </UiButtonArrow>
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  --fs-gallery-height: #{rem(228)};
  --fs-gallery-radius: #{rem(24)};

  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;

  @include from-tablet {
    --fs-gallery-height: #{rem(400)};
    --fs-gallery-radius: #{rem(48)};
  }

  @include from-desktop {
    --fs-gallery-height: #{rem(512)};
    --fs-gallery-radius: #{rem(60)};
  }
}

.viewport {
  flex-shrink: 0;
  width: 100%;
  height: var(--fs-gallery-height);
  overflow: clip;
  border-radius: var(--fs-gallery-radius);
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--fs-color-light);
}

.placeholderLogo {
  width: rem(120);
  opacity: 0.25;

  @include from-desktop {
    width: rem(160);
  }
}

.controls {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.counter {
  display: flex;
  gap: rem(4);
  margin: 0;
  @include fs-h4;
  color: var(--fs-color-black);
}

.counterTotal {
  color: var(--fs-color-gray);
}
</style>
