<script setup lang="ts">
import type { HomeLoyaltyCardVariant } from '#shared/types/home'

withDefaults(
  defineProps<{
    id: string
    title: string
    description: string
    variant: HomeLoyaltyCardVariant
    illustrationAlt: string
    illustrationSrc?: string
    shadowBackSrc?: string
    giftCardFrontSrc?: string
    giftCardBackSrc?: string
    buttonLabel: string
    to?: string
  }>(),
  {
    illustrationSrc: undefined,
    shadowBackSrc: undefined,
    giftCardFrontSrc: undefined,
    giftCardBackSrc: undefined,
    to: undefined,
  },
)
</script>

<template>
  <article :id="id" :class="$style.root" :data-variant="variant">
    <div :class="$style.content">
      <h3 :class="$style.title">{{ title }}</h3>
      <p :class="$style.description">{{ description }}</p>

      <UiButton :class="$style.action" :to="to">
        {{ buttonLabel }}
      </UiButton>
    </div>

    <div :class="$style.illustration">
      <div :class="$style.stage">
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
    </div>
  </article>
</template>

<style module lang="scss">
@use 'tools' as *;

$loyalty-hover-ease: cubic-bezier(0.33, 1, 0.18, 1);
$loyalty-hover-duration: 0.65s;

.root {
  position: relative;
  height: rem(414);
  border-radius: var(--fs-radius-3xl);
  background-color: var(--fs-color-light);
  overflow: hidden;
  transition: border-radius $loyalty-hover-duration $loyalty-hover-ease;

  &[data-variant='gift'] {
    /* Mob Figma 343×414: текст ниже и уже. */
    .content {
      top: rem(124);
      width: min(calc(100% - rem(60)), rem(284));
    }
  }

  @include from-desktop {
    height: rem(488);

    &[data-variant='gift'] .content {
      top: rem(56);
      width: min(calc(100% - rem(48)), rem(632));
    }
  }

  /* Раскрытие CTA только на устройствах с hover; на touch кнопка всегда видна. */
  @media (hover: hover) {
    &:hover,
    &:focus-within {
      border-radius: var(--fs-radius-pill);

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
        transition-delay: 0.18s;
        visibility: visible;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.content {
  position: absolute;
  top: rem(48);
  left: 50%;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: rem(12);
  align-items: center;
  width: min(calc(100% - rem(32)), rem(311));
  text-align: center;
  transition:
    top $loyalty-hover-duration $loyalty-hover-ease,
    transform $loyalty-hover-duration $loyalty-hover-ease;
  transform: translateX(-50%);

  @include from-desktop {
    top: rem(56);
    gap: var(--fs-space-2);
    width: min(calc(100% - rem(48)), rem(632));
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
  opacity: 1;
  transition:
    opacity 0.45s ease,
    visibility 0.45s ease;
  visibility: visible;

  @include from-desktop {
    margin-top: var(--fs-space-2);
  }

  @media (hover: hover) {
    opacity: 0;
    visibility: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transition: none;
    visibility: visible;
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

/* Mob: фиксированная сцена 343px — rem-позиции не плывут на широкой карточке. */
.stage {
  position: absolute;
  inset-block: 0;
  left: 50%;
  width: rem(343);
  max-width: 100%;
  transform: translateX(-50%);

  @include from-desktop {
    inset: 0;
    width: auto;
    max-width: none;
    transform: none;
  }
}

.phones {
  position: absolute;
  top: rem(176);
  left: rem(35);
  width: rem(277);
  height: auto;
  object-fit: contain;

  @include from-desktop {
    top: 10.66%;
    left: 11.72%;
    width: 76.56%;
  }
}

.shadowBack {
  position: absolute;
  top: rem(285);
  left: rem(55);
  width: rem(237);
  height: auto;
  object-fit: contain;

  @include from-desktop {
    top: 58.1%;
    left: 17.25%;
    width: 65.53%;
  }
}

.giftCardBack {
  position: absolute;
  top: rem(263);
  left: rem(139);
  width: rem(171);
  height: auto;
  object-fit: contain;
  transform: rotate(-19.83deg);

  @include from-desktop {
    top: 49.59%;
    left: 44.79%;
    width: 46.06%;
  }
}

.giftCardFront {
  position: absolute;
  top: rem(222);
  left: 0;
  width: rem(171);
  height: auto;
  object-fit: contain;
  transform: rotate(19.62deg);

  @include from-desktop {
    top: 34.63%;
    left: 12.37%;
    width: 46.02%;
  }
}
</style>
