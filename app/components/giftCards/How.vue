<script setup lang="ts">
import type { GiftCardsStep } from '#shared/types/giftCards'

const { title, watermarkSrc, steps } = defineProps<{
  title: string
  watermarkSrc: string
  steps: GiftCardsStep[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="gift-cards-how-title">
    <img
      :class="$style.watermark"
      :src="watermarkSrc"
      alt=""
      width="1893"
      height="1888"
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >

    <div :class="$style.inner">
      <h2 id="gift-cards-how-title" :class="$style.title">{{ title }}</h2>

      <ol :class="$style.steps">
        <li
          v-for="step in steps"
          :key="step.id"
          :class="$style.step"
        >
          <span :class="$style.badge" aria-hidden="true">{{ step.number }}</span>
          <p :class="$style.text">{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  overflow: clip;
  padding-block: var(--fs-space-5);
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-desktop {
    padding-block: rem(160);
    border-radius: rem(60);
  }
}

.watermark {
  position: absolute;
  top: rem(-200);
  left: 0;
  width: rem(900);
  height: auto;
  max-width: none;
  pointer-events: none;
  opacity: 0.55;

  @include from-desktop {
    top: rem(-628);
    left: rem(13);
    width: rem(1400);
    opacity: 1;
  }

  @include from-wide {
    width: rem(1893);
  }
}

.inner {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: rem(40);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  text-align: center;
  overflow-wrap: break-word;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    flex-direction: row;
    gap: rem(24);
    align-items: flex-start;
  }
}

.step {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: center;
  min-width: 0;

  @include from-desktop {
    gap: rem(24);
  }
}

.badge {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: rem(56);
  height: rem(64);
  @include fs-h3;
  background-color: var(--fs-color-white);
  border-radius: rem(999);

  @include from-desktop {
    width: rem(78);
    height: rem(88);
  }
}

.text {
  margin: 0;
  text-align: center;
  @include fs-text;
  overflow-wrap: break-word;
}
</style>
