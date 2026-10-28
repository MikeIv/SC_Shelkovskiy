<script setup lang="ts">
interface Activity {
  id: string
  date: string
  dateIso: string
  title: string
}

const activities: Activity[] = [
  {
    id: 'kp',
    date: '26.06.2024',
    dateIso: '2024-06-26',
    title:
      'Издание «Комсомольская правда» включило ТРЦ «Щёлковский» в топ-20 лучших торговых центров Москвы 2024 года',
  },
  {
    id: 'cre',
    date: '26.06.2024',
    dateIso: '2024-06-26',
    title:
      'ТРЦ «Щёлковский» стал лауреатом премии CRE Awards в номинации «Зелёный кирпич»',
  },
  {
    id: 'energy',
    date: '26.06.2024',
    dateIso: '2024-06-26',
    title:
      'ТРЦ «Щёлковский» стал победителем национальной премии потребителей электроэнергии «Золотая опора» 2023 в номинации «Лучший потребитель энергоресурсов в регионе присутствия АО «Мосэнергосбыт»',
  },
]

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
        ref="viewportRef"
        :class="$style.viewport"
        :aria-roledescription="isDesktop ? 'carousel' : undefined"
        aria-label="Награды и социальные активности"
      >
        <ul ref="trackRef" :class="$style.track">
          <li
            v-for="item in activities"
            :key="item.id"
            :class="$style.slide"
          >
            <article :class="$style.card">
              <div :class="$style.pattern" aria-hidden="true">
                <img
                  :class="$style.patternImage"
                  src="/images/responsibility/activity-pattern.svg"
                  alt=""
                  width="651"
                  height="649"
                  decoding="async"
                >
                <div :class="$style.patternFade" />
              </div>

              <div :class="$style.body">
                <time :class="$style.date" :datetime="item.dateIso">{{ item.date }}</time>
                <p :class="$style.cardTitle">{{ item.title }}</p>
              </div>
            </article>
          </li>
        </ul>
      </div>

      <UiButton type="button">Смотреть все</UiButton>
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
  background-color: var(--fs-color-light);
  overflow: clip;
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
