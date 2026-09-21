<script setup lang="ts">
import type { HomeShopCategory } from '#shared/types/home'

const props = withDefaults(
  defineProps<{
    items: HomeShopCategory[]
    buttonLabel?: string
    buttonTo?: string
  }>(),
  {
    buttonLabel: 'Все магазины',
    buttonTo: '/shops',
  },
)

const activeIndex = ref(0)
const revealed = ref<number[]>([0])

const activeItem = computed(() => props.items[activeIndex.value])

function isRevealed(index: number) {
  return revealed.value.includes(index)
}

function setActive(index: number) {
  activeIndex.value = index
  if (!revealed.value.includes(index)) {
    revealed.value = [...revealed.value, index]
  }
}

function resetActive() {
  activeIndex.value = 0
}
</script>

<template>
  <div
    :class="$style.root"
    @mouseleave="resetActive"
  >
    <div
      :class="$style.pattern"
      aria-hidden="true"
    />

    <div :class="$style.images" aria-hidden="true">
      <div :class="[$style.frame, $style.frameLeft]">
        <template v-for="(item, index) in items" :key="`${item.id}-left`">
          <img
            v-if="isRevealed(index)"
            :src="item.leftImageSrc"
            alt=""
            :class="[
              $style.image,
              item.leftImageCrop === 'wide' && $style.imageWide,
              activeIndex === index && $style.imageVisible,
            ]"
            width="350"
            height="420"
            loading="lazy"
            decoding="async"
          >
        </template>
      </div>

      <div :class="[$style.frame, $style.frameRight]">
        <template v-for="(item, index) in items" :key="`${item.id}-right`">
          <img
            v-if="isRevealed(index)"
            :src="item.rightImageSrc"
            alt=""
            :class="[
              $style.image,
              activeIndex === index && $style.imageVisible,
            ]"
            width="440"
            height="470"
            loading="lazy"
            decoding="async"
          >
        </template>
      </div>
    </div>

    <div :class="$style.nav">
      <ul :class="$style.list">
        <li
          v-for="(item, index) in items"
          :key="item.id"
          :class="$style.item"
        >
          <button
            type="button"
            :class="[
              $style.category,
              activeIndex === index && $style.categoryActive,
            ]"
            :aria-pressed="activeIndex === index"
            @mouseenter="setActive(index)"
            @focus="setActive(index)"
            @click="setActive(index)"
          >
            {{ item.title }}
          </button>
        </li>
      </ul>

      <UiButton :class="$style.action" :to="buttonTo">
        {{ buttonLabel }}
      </UiButton>
    </div>

    <span :class="$style.srOnly" aria-live="polite">
      {{ activeItem?.title }}
    </span>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

$shop-category-ease: cubic-bezier(0.33, 1, 0.18, 1);
$shop-category-duration: 0.55s;
$shop-category-left-width: 350;
$shop-category-left-height: 420;
$shop-category-right-width: 440;
$shop-category-right-height: 470;
$shop-category-left-inset: rem(545 + $shop-category-left-width * 0.5);
$shop-category-right-inset: rem(540 + $shop-category-right-width * 0.5);
$shop-category-pattern-desktop: 1220;
$shop-category-pattern-desktop-right: (
    $shop-category-pattern-desktop - $shop-category-right-width
  ) * 0.5;
$shop-category-pattern-desktop-bottom: (
    $shop-category-pattern-desktop - $shop-category-right-height
  ) * 0.5;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: rem(720);
  padding-top: rem(203);
  overflow: clip;

  @include from-desktop {
    justify-content: center;
    min-height: rem(618);
    padding-top: 0;
    overflow: visible;
  }
}

.pattern {
  position: absolute;
  right: rem(-100);
  bottom: rem(-95);
  width: rem(374);
  height: rem(373);
  pointer-events: none;
  background-color: var(--fs-color-black);
  opacity: 0.08;
  mask: url('/images/home/categories/pattern.svg') center / contain no-repeat;

  @include from-desktop {
    right: calc(
      max(0px, 50% - #{$shop-category-right-inset}) - #{rem($shop-category-pattern-desktop-right)}
    );
    bottom: rem($shop-category-pattern-desktop-bottom * -1);
    width: rem($shop-category-pattern-desktop);
    height: rem($shop-category-pattern-desktop);
    background-color: var(--fs-color-beige);
    opacity: 0.2;
  }
}

.images {
  position: absolute;
  inset: 0;
  z-index: z('default');
  pointer-events: none;
}

.frame {
  position: relative;
  overflow: hidden;
}

.frameLeft {
  position: absolute;
  top: 0;
  left: 0;
  width: rem(138);
  height: rem(166);
  border-radius: var(--fs-radius-2xl);

  @include from-desktop {
    left: max(0px, calc(50% - #{$shop-category-left-inset}));
    width: rem($shop-category-left-width);
    height: rem($shop-category-left-height);
    border-radius: var(--fs-radius-3xl);
  }
}

.frameRight {
  position: absolute;
  right: 0;
  bottom: 0;
  width: rem(175);
  height: rem(187);
  border-radius: 50%;

  @include from-desktop {
    right: max(0px, calc(50% - #{$shop-category-right-inset}));
    width: rem($shop-category-right-width);
    height: rem($shop-category-right-height);
  }
}

.image {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity $shop-category-duration $shop-category-ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.imageWide {
  width: 180%;
  max-width: none;
  margin-left: -80%;
}

.imageVisible {
  opacity: 1;
}

.nav {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: rem(28);
  align-items: center;
  width: 100%;

  @include from-desktop {
    gap: rem(40);
    width: auto;
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: rem(28);
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    gap: rem(24);
  }
}

.item {
  min-width: 0;
}

.category {
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-h2;
  color: var(--fs-color-gray);
  white-space: nowrap;
  background: none;
  cursor: pointer;
  appearance: none;
  transition: color $shop-category-duration $shop-category-ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(4);
  }
}

.categoryActive {
  color: var(--fs-color-black);
}

.action {
  flex-shrink: 0;
}

.srOnly {
  position: absolute;
  width: rem(1);
  height: rem(1);
  margin: rem(-1);
  padding: 0;
  border: 0;
  overflow: hidden;
  white-space: nowrap;
  clip: rect(0, 0, 0, 0);
}
</style>
