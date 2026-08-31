<script setup lang="ts">
import type { HomeLoyaltyCard } from '#shared/types/home'

defineProps<HomeLoyaltyCard>()
</script>

<template>
  <article :id="id" :class="$style.root">
    <div :class="$style.content">
      <h3 :class="$style.title">{{ title }}</h3>
      <p :class="$style.description">{{ description }}</p>

      <UiButton :class="$style.action" :to="to">
        {{ buttonLabel }}
      </UiButton>
    </div>

    <div :class="$style.illustration" aria-hidden="true">
      <template v-if="variant === 'loyalty'">
        <img
          v-if="shadowBackSrc"
          :src="shadowBackSrc"
          alt=""
          :class="$style.shadowBack"
          width="503"
          height="356"
          loading="lazy"
          decoding="async"
        >
        <img
          v-if="illustrationSrc"
          :src="illustrationSrc"
          :alt="illustrationAlt"
          :class="$style.phones"
          width="588"
          height="588"
          loading="lazy"
          decoding="async"
        >
      </template>

      <template v-else>
        <img
          v-if="giftCardBackSrc"
          :src="giftCardBackSrc"
          alt=""
          :class="$style.giftCardBack"
          width="354"
          height="246"
          loading="lazy"
          decoding="async"
        >
        <img
          v-if="giftCardFrontSrc"
          :src="giftCardFrontSrc"
          :alt="illustrationAlt"
          :class="$style.giftCardFront"
          width="354"
          height="289"
          loading="lazy"
          decoding="async"
        >
      </template>
    </div>
  </article>
</template>

<style module lang="scss">
@use 'tools' as *;

$loyalty-hover-ease: cubic-bezier(0.33, 1, 0.18, 1);
$loyalty-hover-duration: 0.65s;

.root {
  position: relative;
  height: rem(400);
  border-radius: rem(32);
  background-color: var(--fs-color-light);
  overflow: hidden;
  transition: border-radius $loyalty-hover-duration $loyalty-hover-ease;

  @include from-desktop {
    height: rem(488);
  }

  @media (hover: hover) {
    &:hover,
    &:focus-within {
      border-radius: rem(9999);

      .content {
        top: 50%;
        transform: translate(-50%, calc(-50% - rem(12)));
      }

      .illustration {
        opacity: 0;
        transform: scale(0.98);
      }

      .action {
        opacity: 1;
        visibility: visible;
        transition-delay: 0.18s;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.content {
  position: absolute;
  top: rem(40);
  left: 50%;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: center;
  width: min(calc(100% - rem(48)), rem(632));
  text-align: center;
  transform: translateX(-50%);
  transition:
    top $loyalty-hover-duration $loyalty-hover-ease,
    transform $loyalty-hover-duration $loyalty-hover-ease;

  @include from-desktop {
    top: rem(56);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.title {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
}

.description {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-black);
}

.action {
  opacity: 0;
  visibility: hidden;
  margin-top: var(--fs-space-2);
  transition:
    opacity 0.45s ease,
    visibility 0.45s ease;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    visibility: visible;
    transition: none;
  }
}

.illustration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition:
    opacity 0.55s $loyalty-hover-ease 0.04s,
    transform 0.55s $loyalty-hover-ease 0.04s;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.phones {
  position: absolute;
  top: 10.66%;
  left: 11.72%;
  width: 76.56%;
  height: auto;
  object-fit: contain;
}

.shadowBack {
  position: absolute;
  top: 58.1%;
  left: 17.25%;
  width: 65.53%;
  height: auto;
  object-fit: contain;
}

.giftCardBack {
  position: absolute;
  top: 49.59%;
  left: 44.79%;
  width: 46.06%;
  height: auto;
  object-fit: contain;
  transform: rotate(-19.83deg);
}

.giftCardFront {
  position: absolute;
  top: 34.63%;
  left: 12.37%;
  width: 46.02%;
  height: auto;
  object-fit: contain;
  transform: rotate(19.62deg);
}
</style>
