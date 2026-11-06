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
    /** id произведения в Афише — по нему открывается виджет покупки. */
    creationId?: string
    /** Продажа открыта по данным Афиши: кнопка активна даже без ссылки на билеты. */
    onSale?: boolean
    /** id города и площадки Афиши для виджета: показывает сеансы кинотеатра ТРЦ. */
    cityId?: string | null
    placeId?: string | null
  }>(),
  {
    ageRating: undefined,
    ticketUrl: undefined,
    creationId: undefined,
    onSale: undefined,
    cityId: null,
    placeId: null,
  },
)

const { openTicket } = useAfishaWidget()

/**
 * Кнопка активна, если у фильма есть продажа: либо Афиша прислала ссылку на билеты,
 * либо открыт виджет по `creationId`. Моки без продажи остаются с «Билеты скоро».
 */
const canBuyTicket = computed(
  () =>
    Boolean(props.ticketUrl && props.ticketUrl !== '#') ||
    Boolean(props.creationId && props.onSale),
)

async function onBuyTicket() {
  if (props.creationId) {
    const opened = await openTicket({
      creationId: props.creationId,
      cityId: props.cityId,
      placeId: props.placeId,
    })

    if (opened) return
  }

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
        :title="canBuyTicket ? undefined : 'Продажа билетов пока недоступна'"
        @click="onBuyTicket"
      >
        {{ canBuyTicket ? 'Купить билет' : 'Билеты скоро' }}
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
  height: 100%;
}

.poster {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 372 / 560;
  border-radius: var(--fs-radius-2xl);
  overflow: clip;

  @include from-desktop {
    border-radius: var(--fs-radius-3xl);
  }
}

.posterImage {
  position: absolute;
  inset: 0;
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
  flex: 1;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  min-width: 0;
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
  @include fs-line-clamp(2);
  color: var(--fs-color-black);
}

.genres {
  margin: 0;
  @include fs-text-lg;
  @include fs-line-clamp(2);
  color: var(--fs-color-black);
}
</style>
