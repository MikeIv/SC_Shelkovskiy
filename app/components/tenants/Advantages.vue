<script setup lang="ts">
import type { TenantsAdvantage } from '#shared/types/tenants'

const { title, items } = defineProps<{
  title: string
  items: TenantsAdvantage[]
}>()

/** Mobile accordion / desktop tabs — один выбранный пункт. */
const activeId = ref(items[0]?.id ?? '')

const activeItem = computed(
  () => items.find((item) => item.id === activeId.value) ?? items[0],
)

function toggle(id: string) {
  activeId.value = activeId.value === id ? '' : id
}

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

    <ul :class="$style.accordion">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.accordionItem"
      >
        <button
          type="button"
          :class="$style.accordionTrigger"
          :aria-expanded="activeId === item.id"
          :aria-controls="`tenants-advantage-acc-${item.id}`"
          @click="toggle(item.id)"
        >
          <span :class="$style.accordionTitle">{{ item.title }}</span>
          <span :class="$style.iconWrap" aria-hidden="true">
            <UIcon
              name="local:arrow-down"
              :class="[$style.icon, { [$style.iconOpen]: activeId === item.id }]"
            />
          </span>
        </button>

        <div
          v-if="activeId === item.id"
          :id="`tenants-advantage-acc-${item.id}`"
          :class="$style.accordionPanel"
        >
          <ul :class="$style.points">
            <li
              v-for="(point, index) in item.points"
              :key="`${item.id}-${index}`"
              :class="$style.point"
            >
              <span :class="$style.bullet" aria-hidden="true" />
              <p :class="$style.pointText">
                {{ point }}
              </p>
            </li>
          </ul>

          <div :class="$style.media">
            <img
              :class="$style.image"
              :src="item.imageSrc"
              :alt="item.imageAlt"
              width="1008"
              height="1112"
              decoding="async"
            >
          </div>
        </div>
      </li>
    </ul>

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
          :aria-selected="item.id === activeItem?.id"
          :tabindex="item.id === activeItem?.id ? 0 : -1"
          :aria-controls="`tenants-advantage-panel-${item.id}`"
          @click="activeId = item.id"
        >
          {{ item.title }}
        </button>
      </div>

      <div :class="$style.mediaDesk" aria-hidden="true">
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
  gap: var(--fs-space-5);

  @include from-desktop {
    gap: rem(64);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    display: none;
  }
}

.accordionItem {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
}

.accordionTrigger {
  display: flex;
  gap: rem(8);
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  text-align: left;
  background: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(4);
    border-radius: rem(4);
  }
}

.accordionTitle {
  @include fs-h3;
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: break-word;
}

.iconWrap {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: rem(32);
  height: rem(32);
}

.icon {
  width: rem(24);
  height: rem(24);
  color: var(--fs-color-black);
  transition: transform 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.iconOpen {
  transform: rotate(180deg);
}

.accordionPanel {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: center;
  min-width: 0;
}

.body {
  display: none;

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
  gap: var(--fs-space-4);
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
  transition: color 0.12s linear;

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

.media,
.mediaDesk {
  position: relative;
  overflow: clip;
  border-radius: 50%;
}

.media {
  width: min(100%, rem(277));
  aspect-ratio: 277 / 304;
}

.mediaDesk {
  align-self: center;
  width: rem(504);
  height: rem(556);
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
  width: 100%;
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
  transition: opacity 0.12s linear;

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
