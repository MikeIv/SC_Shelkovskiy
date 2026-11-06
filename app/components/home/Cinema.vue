<script setup lang="ts">
import type { HomeCinemaFilm } from '#shared/types/home'

const {
  items,
  cityId = null,
  placeId = null,
  isDemo = false,
} = defineProps<{
  items: HomeCinemaFilm[]
  /** id города Афиши — нужен её виджету покупки. */
  cityId?: string | null
  /** id площадки Афиши — фильтр расписания в виджете. */
  placeId?: string | null
  /** Раздел подставлен из мока — ярлык «Демо-данные». */
  isDemo?: boolean
}>()

const {
  viewportRef,
  trackRef,
  canScrollPrev,
  canScrollNext,
  showNav,
  scrollByCard,
} = useScrollCarousel()

/** Виджет Афиши не поднялся — возвращаемся к карточкам-заглушкам. */
const widgetFailed = ref(false)

/**
 * Своих данных нет — показываем встроенное расписание Афиши. На статическом стенде
 * серверной ручки `/api/cinema` нет, а виджет работает из браузера без ключа партнёра.
 */
const showWidget = computed(
  () => !widgetFailed.value && (isDemo || items.length === 0),
)

const { openPlaceSchedule } = useAfishaWidget()

/**
 * «Смотреть все» открывает модальное расписание кинотеатра из виджета Афиши — те же фильмы
 * и сеансы, что в карточках. SDK не поднялся — уводим в общий каталог развлечений.
 */
async function onShowAll() {
  const opened = await openPlaceSchedule(placeId)

  if (!opened) await navigateTo('/entertainment')
}
</script>

<template>
  <section :class="$style.root" aria-labelledby="home-cinema-title">
    <div :class="$style.inner">
      <div :class="$style.head">
        <div :class="$style.headTitle">
          <h2 id="home-cinema-title" :class="$style.title">Кино</h2>
          <UiDemoDataBadge v-if="isDemo && !showWidget" />
        </div>

        <div v-if="showNav && !showWidget" :class="$style.nav">
          <UiButtonArrow
            direction="left"
            :disabled="!canScrollPrev"
            @click="scrollByCard(-1)"
          >
            Предыдущие фильмы
          </UiButtonArrow>
          <UiButtonArrow
            direction="right"
            :disabled="!canScrollNext"
            @click="scrollByCard(1)"
          >
            Следующие фильмы
          </UiButtonArrow>
        </div>
      </div>

      <HomeCinemaWidget
        v-if="showWidget"
        :class="$style.widget"
        @failed="widgetFailed = true"
      />

      <div
        v-else
        ref="viewportRef"
        :class="$style.viewport"
        aria-roledescription="carousel"
        aria-label="Кино"
      >
        <ul ref="trackRef" :class="$style.track">
          <li
            v-for="item in items"
            :key="item.id"
            :class="$style.slide"
          >
            <HomeCinemaCard
              v-bind="item"
              :city-id="cityId"
              :place-id="placeId"
            />
          </li>
        </ul>
      </div>

      <UiButton v-if="!showWidget" type="button" @click="onShowAll">Смотреть все</UiButton>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  /* Гасит горизонтальный скролл fs-carousel-viewport. */
  overflow-x: clip;
}

.inner {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;
  padding-inline: var(--fs-grid-margin);

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
  margin: 0;
  @include fs-h1;
  color: var(--fs-color-black);
}

.headTitle {
  display: flex;
  flex-wrap: wrap;
  gap: rem(12);
  align-items: center;
  min-width: 0;
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
  @include fs-carousel-viewport;
}

.widget {
  width: 100%;
}

.track {
  display: flex;
  gap: var(--fs-space-3);
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
}

.slide {
  display: flex;
  flex: 0 0 rem(320);
  scroll-snap-align: start;

  @include from-desktop {
    flex: 0 0 rem(372);
  }
}
</style>
