<script setup lang="ts">
import type { LoyaltyLevel } from '#shared/types/loyalty'

const { title, items } = defineProps<{
  title: string
  items: LoyaltyLevel[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="loyalty-levels-title">
    <h2 id="loyalty-levels-title" :class="$style.title">{{ title }}</h2>

    <ul :class="$style.cards">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.card"
      >
        <div :class="$style.head">
          <div :class="$style.coinWrap">
            <img
              :class="$style.coin"
              :src="item.imageSrc"
              :alt="item.imageAlt"
              width="148"
              height="148"
              loading="lazy"
              decoding="async"
            >
          </div>
          <h3 :class="$style.cardTitle">{{ item.title }}</h3>
          <p :class="$style.desc">{{ item.description }}</p>
        </div>

        <ul :class="$style.perks">
          <li
            v-for="(perk, index) in item.perks"
            :key="`${item.id}-${index}`"
            :class="$style.perk"
          >
            <UIcon
              name="local:star"
              :class="$style.star"
              aria-hidden="true"
            />
            <span>{{ perk }}</span>
          </li>
        </ul>
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
    gap: rem(40);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include from-desktop {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: rem(32);
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;
  padding: var(--fs-space-4);
  border: rem(2) solid var(--fs-color-light);
  border-radius: rem(32);
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: center;
  text-align: center;
}

.coinWrap {
  display: grid;
  place-items: center;
  width: rem(120);
  height: rem(136);
  overflow: hidden;
  background-color: var(--fs-color-white);
  border-radius: rem(999);

  @include from-desktop {
    width: rem(148);
    height: rem(168);
  }
}

.coin {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.cardTitle {
  @include fs-h3;
  margin: 0;
}

.desc {
  margin: 0;
  @include fs-text;
  color: var(--fs-color-gray);
  overflow-wrap: break-word;
}

.perks {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.perk {
  display: flex;
  gap: rem(8);
  align-items: flex-start;
  @include fs-text;
  overflow-wrap: break-word;
}

.star {
  flex: 0 0 auto;
  width: rem(16);
  height: rem(16);
  margin-top: rem(2);
  color: var(--fs-color-beige);
}
</style>
