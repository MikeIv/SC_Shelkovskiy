<script setup lang="ts">
import type { HomeGalleryAlbum } from '#shared/types/home'

const { items, isDemo = false } = defineProps<{
  items: HomeGalleryAlbum[]
  /** Раздел подставлен из мока — ярлык «Демо-данные». */
  isDemo?: boolean
}>()

const {
  viewportRef,
  trackRef,
  canScrollPrev,
  canScrollNext,
  showNav: showHeadNav,
  showFootNav,
  scrollByCard,
} = useScrollCarousel()

const activeAlbum = ref<HomeGalleryAlbum | null>(null)
const mediaSrc = useMediaSrc()
const { photos: albumPhotos, pending: albumPending, loadPhotos } = useGalleryAlbum()

const lightboxImages = computed(() =>
  albumPhotos.value.map((photo) => mediaSrc(photo, 1600)),
)

function openAlbum(album: HomeGalleryAlbum): void {
  /** Фото нет — открывать нечего: у видео-альбома карточка не кликабельна. */
  if (album.photoCount <= 0) {
    return
  }

  activeAlbum.value = album
  void loadPhotos(album)
}

function closeLightbox(): void {
  activeAlbum.value = null
}
</script>

<template>
  <section :class="$style.root" aria-labelledby="home-gallery-title">
    <div :class="$style.inner">
      <div :class="$style.head">
        <div :class="$style.headTitle">
          <h2 id="home-gallery-title" :class="$style.title">Галерея</h2>
          <UiDemoDataBadge v-if="isDemo" />
        </div>

        <div v-if="showHeadNav" :class="$style.nav">
          <UiButtonArrow
            direction="left"
            :disabled="!canScrollPrev"
            @click="scrollByCard(-1)"
          >
            Предыдущие альбомы
          </UiButtonArrow>
          <UiButtonArrow
            direction="right"
            :disabled="!canScrollNext"
            @click="scrollByCard(1)"
          >
            Следующие альбомы
          </UiButtonArrow>
        </div>
      </div>

      <div
        ref="viewportRef"
        :class="$style.viewport"
        aria-roledescription="carousel"
        aria-label="Галерея"
      >
        <ul ref="trackRef" :class="$style.track">
          <li
            v-for="item in items"
            :key="item.id"
            :class="$style.slide"
          >
            <HomeGalleryCard
              v-bind="item"
              @select="openAlbum(item)"
            />
          </li>
        </ul>
      </div>

      <div v-if="showFootNav" :class="$style.footNav">
        <UiButtonArrow
          direction="left"
          :disabled="!canScrollPrev"
          @click="scrollByCard(-1)"
        >
          Предыдущие альбомы
        </UiButtonArrow>
        <UiButtonArrow
          direction="right"
          :disabled="!canScrollNext"
          @click="scrollByCard(1)"
        >
          Следующие альбомы
        </UiButtonArrow>
      </div>

      <UiButton :class="$style.allBtn" to="/gallery">Смотреть все</UiButton>
    </div>

    <GalleryLightbox
      :open="activeAlbum !== null"
      :images="lightboxImages"
      :pending="albumPending"
      :alt="activeAlbum?.imageAlt ?? ''"
      @close="closeLightbox"
    />
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

.headTitle {
  display: flex;
  flex-wrap: wrap;
  gap: rem(12);
  align-items: center;
  min-width: 0;
}

.title {
  margin: 0;
  @include fs-h1;
  color: var(--fs-color-black);
}

.nav {
  /* Стрелки шапки — только desktop (Tab+ листается свайпом). */
  display: none;
  gap: var(--fs-space-4);
  align-items: center;
  flex-shrink: 0;

  @include from-desktop {
    display: flex;
  }
}

.viewport {
  @include fs-carousel-viewport;
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
  flex: 0 0 calc(100vw - 2 * var(--fs-grid-margin));
  scroll-snap-align: start;

  /* Tab 343 + peek; Desk 768 (Figma Gallery). */
  @include from-tablet {
    flex: 0 0 rem(343);
  }

  @include from-desktop {
    flex: 0 0 rem(768);
  }
}

.footNav {
  /* Только mobile: на Tab+ стрелок нет по макету — решает `showFootNav`. */
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.allBtn {
  display: none;

  @include from-desktop {
    display: inline-flex;
  }
}
</style>
