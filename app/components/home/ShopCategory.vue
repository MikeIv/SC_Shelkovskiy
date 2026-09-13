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

const activeItem = computed(() => props.items[activeIndex.value])

function setActive(index: number) {
  activeIndex.value = index
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
    <img
      :class="$style.pattern"
      src="/images/home/categories/pattern.svg"
      alt=""
      width="374"
      height="373"
      aria-hidden="true"
      decoding="async"
    >

    <div :class="$style.images" aria-hidden="true">
      <div :class="[$style.frame, $style.frameLeft]">
        <img
          v-for="(item, index) in items"
          :key="`${item.id}-left`"
          :src="item.leftImageSrc"
          alt=""
          :class="[
            $style.image,
            item.leftImageCrop === 'wide' && $style.imageWide,
            activeIndex === index && $style.imageVisible,
          ]"
          width="350"
          height="420"
          :loading="index === 0 ? 'eager' : 'lazy'"
          decoding="async"
        >
      </div>

      <div :class="[$style.frame, $style.frameRight]">
        <img
          v-for="(item, index) in items"
          :key="`${item.id}-right`"
          :src="item.rightImageSrc"
          alt=""
          :class="[
            $style.image,
            activeIndex === index && $style.imageVisible,
          ]"
          width="440"
          height="470"
          :loading="index === 0 ? 'eager' : 'lazy'"
          decoding="async"
        >
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
            :aria-current="activeIndex === index ? 'true' : undefined"
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
      {{ activeItem?.leftImageAlt }}
      {{ activeItem?.rightImageAlt }}
    </span>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

$shop-category-ease: cubic-bezier(0.33, 1, 0.18, 1);
$shop-category-duration: 0.55s;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: rem(720);
  padding-top: rem(203);
  overflow: clip;

  @include from-desktop {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: var(--fs-space-3);
    align-items: center;
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
  opacity: 0.08;

  @include from-desktop {
    display: none;
  }
}

.images {
  position: absolute;
  inset: 0;
  z-index: z('default');
  pointer-events: none;

  @include from-desktop {
    position: static;
    display: contents;
    pointer-events: auto;
  }
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
  border-radius: rem(24);

  @include from-desktop {
    position: relative;
    top: auto;
    left: auto;
    grid-row: 1;
    grid-column: 1;
    justify-self: end;
    align-self: start;
    width: min(100%, rem(350));
    height: rem(420);
    margin-top: rem(50);
    border-radius: rem(32);
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
    position: relative;
    right: auto;
    bottom: auto;
    grid-row: 1;
    grid-column: 3;
    justify-self: start;
    align-self: end;
    width: min(100%, rem(440));
    height: rem(470);
    margin-bottom: rem(74);
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
    grid-row: 1;
    grid-column: 2;
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
