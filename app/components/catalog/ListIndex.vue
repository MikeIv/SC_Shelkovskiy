<script setup lang="ts">
import {
  CATALOG_LIST_CYRILLIC_LETTERS,
  CATALOG_LIST_DIGIT_GROUP,
  CATALOG_LIST_LATIN_LETTERS,
  catalogListSectionId,
} from '#shared/utils/catalogListLetters'

const { availableLetters } = defineProps<{
  availableLetters: ReadonlySet<string>
}>()

function isAvailable(letter: string): boolean {
  return availableLetters.has(letter)
}

function scrollToLetter(letter: string): void {
  if (!isAvailable(letter) || !import.meta.client) {
    return
  }

  const target = document.getElementById(catalogListSectionId(letter))

  if (!target) {
    return
  }

  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

  target.scrollIntoView({ behavior, block: 'start' })
  target.focus({ preventScroll: true })
}
</script>

<template>
  <nav :class="$style.root" aria-label="Алфавитный указатель">
    <div :class="$style.row">
      <CatalogListIndexLetter
        :class="$style.digit"
        :letter="CATALOG_LIST_DIGIT_GROUP"
        :available="isAvailable(CATALOG_LIST_DIGIT_GROUP)"
        @select="scrollToLetter"
      />

      <ul :class="$style.letters">
        <li v-for="letter in CATALOG_LIST_LATIN_LETTERS" :key="letter">
          <CatalogListIndexLetter
            :letter="letter"
            :available="isAvailable(letter)"
            @select="scrollToLetter"
          />
        </li>
      </ul>
    </div>

    <div :class="$style.row">
      <ul :class="$style.letters">
        <li v-for="letter in CATALOG_LIST_CYRILLIC_LETTERS" :key="letter">
          <CatalogListIndexLetter
            :letter="letter"
            :available="isAvailable(letter)"
            @select="scrollToLetter"
          />
        </li>
      </ul>
    </div>
  </nav>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  min-width: 0;
}

.row {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--fs-space-4);
  align-items: center;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from-tablet {
    flex-wrap: wrap;
    gap: rem(32);
    overflow-x: visible;
  }

  @include from-desktop {
    gap: rem(56);
  }
}

.digit {
  flex-shrink: 0;
}

.letters {
  display: flex;
  flex-shrink: 0;
  flex-wrap: nowrap;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-tablet {
    flex-wrap: wrap;
  }
}
</style>
