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

    <ul :class="$style.letters">
      <li v-for="letter in CATALOG_LIST_CYRILLIC_LETTERS" :key="letter">
        <CatalogListIndexLetter
          :letter="letter"
          :available="isAvailable(letter)"
          @select="scrollToLetter"
        />
      </li>
    </ul>
  </nav>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-3);
  align-items: center;

  @include from-desktop {
    gap: rem(56);
  }
}

.letters {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
