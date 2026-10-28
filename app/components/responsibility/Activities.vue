<script setup lang="ts">
import { getAwardsDetailPath } from '#shared/utils/awardsPath'

const { items } = await useAwards()

const {
  viewportRef,
  trackRef,
  canScrollPrev,
  canScrollNext,
  isDesktop,
  showNav,
  scrollByCard,
} = useScrollCarousel()
</script>

<template>
  <section :class="$style.root" aria-labelledby="responsibility-activities-title">
    <div :class="$style.inner">
      <div :class="$style.head">
        <h2 id="responsibility-activities-title" :class="$style.title">
          Награды и социальные активности
        </h2>

        <div v-if="showNav" :class="$style.nav">
          <UiButtonArrow
            direction="left"
            :disabled="!canScrollPrev"
            @click="scrollByCard(-1)"
          >
            Предыдущие награды
          </UiButtonArrow>
          <UiButtonArrow
            direction="right"
            :disabled="!canScrollNext"
            @click="scrollByCard(1)"
          >
            Следующие награды
          </UiButtonArrow>
        </div>
      </div>

      <div
        v-if="items.length"
        ref="viewportRef"
        :class="$style.viewport"
        :aria-roledescription="isDesktop ? 'carousel' : undefined"
        aria-label="Награды и социальные активности"
      >
        <ul ref="trackRef" :class="$style.track">
          <li
            v-for="item in items"
            :key="item.id"
            :class="$style.slide"
          >
            <NuxtLink
              :to="getAwardsDetailPath(item.id)"
              :class="$style.card"
            >
              <div :class="$style.pattern" aria-hidden="true">
                <img
                  :class="$style.patternImage"
                  src="/images/responsibility/activity-pattern.svg"
                  alt=""
                  width="651"
                  height="649"
                  loading="lazy"
                  decoding="async"
                >
                <div :class="$style.patternFade" />
              </div>

              <div :class="$style.body">
                <time
                  v-if="item.date"
                  :class="$style.date"
                  :datetime="item.dateIso"
                >{{ item.date }}</time>
                <p :class="$style.cardTitle">{{ item.title }}</p>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <p
        v-else
        :class="$style.empty"
      >
        Пока нет материалов
      </p>

      <UiButton to="/awards">Смотреть все</UiButton>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  overflow-x: clip;
}

.inner {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-tablet {
    align-items: center;
  }

  @include from-desktop {
    gap: var(--fs-space-5);
  }
}

.head {
  display: flex;
  gap: var(--fs-space-3);
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.title {
  @include fs-h1;
  min-width: 0;
  margin: 0;
  overflow-wrap: break-word;
}

.nav {
  display: none;
  flex-shrink: 0;
  gap: var(--fs-space-4);
  align-items: center;

  @include from-desktop {
    display: flex;
  }
}

.viewport {
  width: 100%;
  min-width: 0;

  @include from-desktop {
    @include fs-carousel-viewport;
  }
}

.track {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    flex-direction: row;
    width: max-content;
  }
}

.slide {
  display: flex;
  min-width: 0;

  /* Ниже desktop секция — превью из трёх карточек, полный список на /awards. */
  &:nth-child(n + 4) {
    display: none;

    @include from-desktop {
      display: flex;
    }
  }

  @include from-desktop {
    flex: 0 0 rem(560);
    scroll-snap-align: start;
  }

  @include from-wide {
    flex: 0 0 rem(768);
  }
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--fs-space-2);
  border-radius: var(--fs-radius-2xl);
  color: inherit;
  text-decoration: none;
  background-color: var(--fs-color-light);
  overflow: clip;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.empty {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

.pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.patternImage {
  position: absolute;
  right: rem(-298);
  bottom: rem(-321);
  width: rem(651);
  max-width: none;
  height: auto;
}

.patternFade {
  position: absolute;
  right: 0;
  bottom: rem(-38);
  width: rem(343);
  height: rem(260);
  background-image: linear-gradient(
    116deg,
    var(--fs-color-light) 15%,
    rgb(243 242 237 / 0%) 87%
  );
}

.body {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  width: 100%;
  min-width: 0;
}

.date {
  @include fs-text-md;
  color: var(--fs-color-gray);
  white-space: nowrap;
}

.cardTitle {
  @include fs-h4;
  margin: 0;
  overflow-wrap: break-word;
}
</style>
