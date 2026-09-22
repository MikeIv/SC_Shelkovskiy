<script setup lang="ts">
import type { CatalogCardItem } from '#shared/types/catalog'
import { catalogListSectionId, groupCatalogListItems } from '#shared/utils/catalogListLetters'

const props = defineProps<{
  items: CatalogCardItem[]
}>()

const groups = computed(() => groupCatalogListItems(props.items))
const availableLetters = computed(
  () => new Set(groups.value.map((group) => group.letter)),
)
</script>

<template>
  <div :class="$style.root">
    <CatalogListIndex :available-letters="availableLetters" />

    <div :class="$style.divider" aria-hidden="true" />

    <div v-if="groups.length" :class="$style.groups">
      <section
        v-for="group in groups"
        :id="catalogListSectionId(group.letter)"
        :key="group.letter"
        :class="$style.group"
        tabindex="-1"
        :aria-labelledby="`${catalogListSectionId(group.letter)}-title`"
      >
        <div :class="$style.row">
          <h2
            :id="`${catalogListSectionId(group.letter)}-title`"
            :class="$style.letter"
          >
            {{ group.letter }}
          </h2>

          <ul :class="$style.items">
            <li
              v-for="item in group.items"
              :key="item.id"
              :class="$style.item"
            >
              <CatalogCard v-bind="item" layout="list" />
            </li>
          </ul>
        </div>

        <div :class="$style.divider" aria-hidden="true" />
      </section>
    </div>

    <p v-else :class="$style.empty">
      По вашему запросу ничего не найдено
    </p>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  width: 100%;
}

.groups {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  scroll-margin-top: var(--fs-space-6);

  @include from-desktop {
    scroll-margin-top: rem(80);
  }
}

.row {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;

  @include from-desktop {
    flex-direction: row;
    gap: var(--fs-space-3);
  }
}

.letter {
  @include fs-h1;
  flex-shrink: 0;
  margin: 0;
  padding: rem(4);

  @include from-desktop {
    width: rem(372);
  }
}

.items {
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--fs-space-3);
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-tablet {
    grid-auto-flow: column;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(2, auto);

    &:has(> :only-child) {
      grid-template-rows: auto;
    }
  }

  @include from-desktop {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.item {
  min-width: 0;

  @include from-desktop {
    max-width: rem(372);
  }
}

.divider {
  width: 100%;
  height: rem(2);
  background-color: var(--fs-color-light);
}

.empty {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}
</style>
