<script setup lang="ts">
import type { LoyaltyBenefit } from '#shared/types/loyalty'

const { title, description, items } = defineProps<{
  title: string
  description: string
  items: LoyaltyBenefit[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="loyalty-benefits-title">
    <div :class="$style.copy">
      <h2 id="loyalty-benefits-title" :class="$style.title">{{ title }}</h2>
      <p :class="$style.desc">{{ description }}</p>
    </div>

    <ul :class="$style.list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <span :class="$style.iconWrap" aria-hidden="true">
          <UIcon
            :name="item.icon"
            :class="$style.icon"
          />
        </span>
        <p :class="$style.text">{{ item.text }}</p>
      </li>
    </ul>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    flex-direction: row;
    gap: rem(24);
    align-items: flex-start;
    justify-content: space-between;
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  max-width: rem(700);
  min-width: 0;

  @include from-desktop {
    flex: 1 1 rem(640);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.desc {
  margin: 0;
  max-width: rem(652);
  @include fs-text;
  overflow-wrap: break-word;
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    flex: 0 1 rem(560);
    gap: rem(32);
    padding-top: rem(8);
  }
}

.item {
  display: flex;
  gap: var(--fs-space-3);
  align-items: center;
  min-width: 0;
}

.iconWrap {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: rem(56);
  height: rem(64);
  border-radius: rem(999);
  background-color: var(--fs-color-light);

  @include from-desktop {
    width: rem(78);
    height: rem(88);
  }
}

.icon {
  width: rem(24);
  height: rem(24);
  color: var(--fs-color-black);
}

.text {
  margin: 0;
  @include fs-text;
  overflow-wrap: break-word;

  @include from-desktop {
    @include fs-text-lg;
  }
}
</style>
