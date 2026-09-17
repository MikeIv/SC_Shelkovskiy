<script setup lang="ts">
import type { HomeGalleryAlbum } from '#shared/types/home'

const { items } = defineProps<{
  items: HomeGalleryAlbum[]
}>()

const {
  viewportRef,
  trackRef,
  canScrollPrev,
  canScrollNext,
  hasOverflow,
  isDesktop,
  showNav: showHeadNav,
  scrollByCard,
} = useScrollCarousel()

const showFootNav = computed(() => !isDesktop.value && hasOverflow.value)
const activeAlbum = ref<HomeGalleryAlbum | null>(null)

function openAlbum(album: HomeGalleryAlbum): void {
  if (!album.photos?.length) {
    return
  }

  activeAlbum.value = album
}

function closeLightbox(): void {
  activeAlbum.value = null
}
</script>

<template>
  <section :class="$style.root" aria-labelledby="home-gallery-title">
    <div :class="$style.inner">
      <div :class="$style.head">
        <h2 id="home-gallery-title" :class="$style.title">Галерея</h2>

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
      :images="activeAlbum?.photos ?? []"
      :alt="activeAlbum?.imageAlt ?? ''"
      @close="closeLightbox"
    />
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

.nav {
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

  @include from-desktop {
    flex: 0 0 rem(768);
  }
}

.footNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @include from-desktop {
    display: none;
  }
}

.allBtn {
  display: inline-flex;
}
</style>
