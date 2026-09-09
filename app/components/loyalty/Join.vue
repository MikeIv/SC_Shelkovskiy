<script setup lang="ts">
import type { LoyaltyJoinStep, LoyaltyStoreLink } from '#shared/types/loyalty'

const { title, steps, storeLinks } = defineProps<{
  title: string
  steps: LoyaltyJoinStep[]
  storeLinks: LoyaltyStoreLink[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="loyalty-join-title">
    <h2 id="loyalty-join-title" :class="$style.title">{{ title }}</h2>

    <ol :class="$style.cards">
      <li
        v-for="step in steps"
        :key="step.id"
        :class="$style.card"
        :data-variant="step.variant"
      >
        <div :class="$style.head">
          <span :class="$style.badge" aria-hidden="true">{{ step.number }}</span>
          <h3 :class="$style.cardTitle">{{ step.title }}</h3>
        </div>

        <LoyaltyStoreLinks
          v-if="step.variant === 'stores'"
          :class="$style.stores"
          :items="storeLinks"
          direction="column"
        />

        <div
          v-else-if="step.imageSrc"
          :class="$style.visual"
          aria-hidden="true"
        >
          <img
            :class="$style.image"
            :src="step.imageSrc"
            alt=""
            :width="step.imageWidth"
            :height="step.imageHeight"
            loading="lazy"
            decoding="async"
          >
        </div>
      </li>
    </ol>
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
  text-align: center;
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
    grid-template-columns: rem(372) minmax(0, 1fr) rem(372);
    gap: rem(24);
    align-items: stretch;
  }
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: rem(360);
  overflow: clip;
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-desktop {
    min-height: rem(488);
  }

  &[data-variant='auth'] {
    background-color: transparent;
  }
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: center;
  padding: var(--fs-space-4) var(--fs-space-2) 0;
  text-align: center;
}

.badge {
  display: grid;
  place-items: center;
  width: rem(64);
  height: rem(72);
  @include fs-h3;
  background-color: var(--fs-color-white);
  border-radius: rem(999);

  @include from-desktop {
    width: rem(78);
    height: rem(88);
  }
}

.card[data-variant='auth'] .badge {
  background-color: var(--fs-color-light);
}

.cardTitle {
  @include fs-h3;
  margin: 0;
  max-width: rem(340);
  overflow-wrap: break-word;
}

.stores {
  margin-top: auto;
  margin-bottom: var(--fs-space-4);
  padding-inline: var(--fs-space-2);
}

.visual {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  min-height: rem(140);
  padding-top: var(--fs-space-3);
  overflow: hidden;
}

.image {
  display: block;
  width: auto;
  max-width: 70%;
  height: auto;
}

.card[data-variant='profile'] .image {
  max-width: rem(182);
  margin-bottom: rem(-40);

  @include from-desktop {
    margin-bottom: rem(-80);
  }
}

.card[data-variant='auth'] .image {
  max-width: rem(164);
  margin-bottom: var(--fs-space-4);
}
</style>
