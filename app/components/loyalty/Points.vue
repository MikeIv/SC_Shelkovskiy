<script setup lang="ts">
import type { LoyaltyPointStep } from '#shared/types/loyalty'

const { title, steps, rulesLabel, rulesHref, phonesSrc, phonesAlt } = defineProps<{
  title: string
  steps: LoyaltyPointStep[]
  rulesLabel: string
  rulesHref: string
  phonesSrc: string
  phonesAlt: string
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="loyalty-points-title">
    <div :class="$style.inner">
      <div :class="$style.copy">
        <h2 id="loyalty-points-title" :class="$style.title">{{ title }}</h2>

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

        <UiButton
          :class="$style.rules"
          :to="rulesHref"
        >
          {{ rulesLabel }}
        </UiButton>
      </div>

      <div :class="$style.media">
        <img
          :class="$style.phones"
          :src="phonesSrc"
          :alt="phonesAlt"
          width="598"
          height="635"
          loading="lazy"
          decoding="async"
        >
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  padding-block: var(--fs-space-5);
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-desktop {
    padding-block: rem(160);
    border-radius: rem(60);
  }
}

.inner {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    flex-direction: row;
    gap: rem(40);
    align-items: flex-start;
  }
}

.copy {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    flex: 1 1 rem(720);
    gap: rem(40);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    gap: rem(24);
  }
}

.step {
  display: flex;
  gap: var(--fs-space-3);
  align-items: center;
  min-width: 0;
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
  @include fs-h3;
  margin: 0;
  overflow-wrap: break-word;
}

.rules {
  align-self: flex-start;
}

.media {
  display: flex;
  flex: 0 1 auto;
  justify-content: center;
  min-width: 0;

  @include from-desktop {
    flex: 0 0 rem(480);
  }

  @include from-wide {
    flex-basis: rem(560);
  }
}

.phones {
  display: block;
  width: min(100%, rem(360));
  height: auto;

  @include from-desktop {
    width: 100%;
  }
}
</style>
