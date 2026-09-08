<script setup lang="ts">
import type { GalleryAlbum } from '#shared/types/gallery'

defineProps<{
  items: GalleryAlbum[]
}>()

const activeAlbum = ref<GalleryAlbum | null>(null)

function openAlbum(album: GalleryAlbum): void {
  activeAlbum.value = album
}

function closeLightbox(): void {
  activeAlbum.value = null
}
</script>

<template>
  <div :class="$style.root">
    <ul
      v-if="items.length"
      :class="$style.list"
      aria-label="Альбомы галереи"
    >
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <HomeGalleryCard
          v-bind="item"
          @select="openAlbum(item)"
        />
      </li>
    </ul>

    <p v-else :class="$style.empty">
      Пока нет альбомов
    </p>

    <GalleryLightbox
      :open="activeAlbum !== null"
      :images="activeAlbum?.photos ?? []"
      :alt="activeAlbum?.imageAlt ?? ''"
      @close="closeLightbox"
    />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  width: 100%;
}

.list {
  display: grid;
  gap: var(--fs-space-5) var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: rem(56) var(--fs-space-3);
  }
}

.item {
  display: flex;
  min-width: 0;
}

.empty {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}
</style>
