<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string
    title: string
    genres: string
    posterSrc: string
    posterAlt: string
    ageRating?: string
    ticketUrl?: string
  }>(),
  {
    ageRating: undefined,
    ticketUrl: undefined,
  },
)

const canBuyTicket = computed(
  () => Boolean(props.ticketUrl && props.ticketUrl !== '#'),
)

function onBuyTicket() {
  const url = props.ticketUrl
  if (!url || url === '#') {
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <article :id="id" :class="$style.root">
    <div :class="$style.poster">
      <img
        :class="$style.posterImage"
        :src="posterSrc"
        :alt="posterAlt"
        width="372"
        height="560"
        loading="lazy"
        decoding="async"
      >

      <UiTag v-if="ageRating" :class="$style.ageTag" variant="other">
        {{ ageRating }}
      </UiTag>
    </div>

    <div :class="$style.body">
      <UiButton
        :class="$style.ticketButton"
        type="button"
        :disabled="!canBuyTicket"
        @click="onBuyTicket"
      >
        Купить билет
      </UiButton>

      <div :class="$style.copy">
        <h3 :class="$style.title">{{ title }}</h3>
        <p :class="$style.genres">{{ genres }}</p>
      </div>
    </div>
  </article>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  width: 100%;
}

.poster {
  position: relative;
  width: 100%;
  aspect-ratio: 372 / 560;
  overflow: clip;
  border-radius: rem(24);

  @include from-desktop {
    border-radius: rem(32);
  }
}

.posterImage {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ageTag {
  position: absolute;
  top: var(--fs-space-2);
  left: var(--fs-space-2);
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
}

.ticketButton {
  width: 100%;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
}

.title {
  margin: 0;
  @include fs-h4;
  color: var(--fs-color-black);
}

.genres {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-black);
}
</style>
