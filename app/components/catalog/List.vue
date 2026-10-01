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
  <div v-if="groups.length" :class="$style.root">
    <CatalogListIndex :available-letters="availableLetters" />

    <div :class="$style.divider" aria-hidden="true" />

    <div :class="$style.groups">
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
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  width: 100%;

  @include from-desktop {
    gap: var(--fs-space-5);
  }
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

  &:last-child .divider {
    display: none;
  }
}

.row {
  display: flex;
  flex-direction: row;
  gap: var(--fs-space-2);
  align-items: flex-start;
  width: 100%;

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.letter {
  @include fs-h1;
  flex-shrink: 0;
  box-sizing: border-box;
  width: max-content;
  min-width: rem(60);
  margin: 0;
  padding: rem(4);
  white-space: nowrap;

  @include from-desktop {
    width: rem(372);
    min-width: rem(372);
  }
}

.items {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-3);
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-tablet {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--fs-space-3) var(--fs-space-2);
  }

  @include from-desktop {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--fs-space-3);
  }
}

.item {
  width: 100%;
  min-width: 0;
}

.divider {
  width: 100%;
  height: rem(2);
  background-color: var(--fs-color-light);
}
</style>
