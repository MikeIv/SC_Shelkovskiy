<script setup lang="ts">
import type { TenantsAdvantage } from '#shared/types/tenants'

const { title, items } = defineProps<{
  title: string
  items: TenantsAdvantage[]
}>()

const activeId = ref(items[0]?.id ?? '')

const activeItem = computed(
  () => items.find((item) => item.id === activeId.value) ?? items[0],
)

onMounted(() => {
  for (const item of items) {
    if (item.id === activeId.value) {
      continue
    }

    const preload = new Image()
    preload.src = item.imageSrc
  }
})
</script>

<template>
  <section :class="$style.root" aria-labelledby="tenants-advantages-title">
    <h2 id="tenants-advantages-title" :class="$style.title">
      {{ title }}
    </h2>

    <div :class="$style.body">
      <div
        :class="$style.nav"
        role="tablist"
        aria-label="Преимущества"
      >
        <button
          v-for="item in items"
          :id="`tenants-advantage-tab-${item.id}`"
          :key="item.id"
          :class="$style.navItem"
          type="button"
          role="tab"
          :aria-selected="item.id === activeId"
          :tabindex="item.id === activeId ? 0 : -1"
          :aria-controls="`tenants-advantage-panel-${item.id}`"
          @click="activeId = item.id"
        >
          {{ item.title }}
        </button>
      </div>

      <div :class="$style.media" aria-hidden="true">
        <Transition
          :enter-active-class="$style.fadeEnterActive"
          :leave-active-class="$style.fadeLeaveActive"
          :enter-from-class="$style.fadeEnterFrom"
          :leave-to-class="$style.fadeLeaveTo"
        >
          <img
            v-if="activeItem"
            :key="activeItem.id"
            :class="$style.image"
            :src="activeItem.imageSrc"
            alt=""
            width="1008"
            height="1112"
            decoding="async"
          >
        </Transition>
      </div>

      <div :class="$style.panelSlot">
        <Transition
          :enter-active-class="$style.fadeEnterActive"
          :leave-active-class="$style.fadeLeaveActive"
          :enter-from-class="$style.fadeEnterFrom"
          :leave-to-class="$style.fadeLeaveTo"
          mode="out-in"
        >
          <div
            v-if="activeItem"
            :id="`tenants-advantage-panel-${activeItem.id}`"
            :key="activeItem.id"
            :class="$style.panel"
            role="tabpanel"
            :aria-labelledby="`tenants-advantage-tab-${activeItem.id}`"
          >
            <ul :class="$style.points">
              <li
                v-for="(point, index) in activeItem.points"
                :key="`${activeItem.id}-${index}`"
                :class="$style.point"
              >
                <span :class="$style.bullet" aria-hidden="true" />
                <p :class="$style.pointText">
                  {{ point }}
                </p>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);

  @include from-desktop {
    gap: rem(40);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);

  @include from-desktop {
    display: grid;
    grid-template-columns: minmax(0, 1fr) rem(504) minmax(0, 1fr);
    gap: var(--fs-space-3);
    align-items: center;
  }
}

.nav {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: stretch;
}

.navItem {
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-h3;
  color: var(--fs-color-gray);
  text-align: left;
  background: transparent;
  cursor: pointer;
  appearance: none;
  transition: color 0.25s ease;

  &[aria-selected='true'] {
    color: var(--fs-color-black);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(4);
    border-radius: rem(4);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--fs-color-black);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.media {
  position: relative;
  align-self: center;
  width: min(100%, rem(320));
  aspect-ratio: 1;
  overflow: clip;
  border-radius: 50%;

  @include from-desktop {
    width: rem(504);
    height: rem(556);
    aspect-ratio: auto;
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
}

.panelSlot {
  position: relative;
  min-width: 0;
  min-height: rem(120);
}

.panel {
  min-width: 0;
}

.points {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  margin: 0;
  padding: 0;
  list-style: none;
}

.point {
  display: flex;
  gap: rem(8);
  align-items: baseline;
}

.bullet {
  flex-shrink: 0;
  width: rem(8);
  height: rem(8);
  border-radius: 50%;
  background-color: var(--fs-color-beige);
  transform: translateY(rem(-2));
}

.pointText {
  margin: 0;
  @include fs-text-lg;
  overflow-wrap: break-word;
}

.fadeEnterActive,
.fadeLeaveActive {
  transition: opacity 0.4s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.fadeLeaveActive {
  position: absolute;
  inset: 0;
}

.fadeEnterFrom,
.fadeLeaveTo {
  opacity: 0;
}
</style>
