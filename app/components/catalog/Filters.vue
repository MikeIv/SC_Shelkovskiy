<script setup lang="ts">
import type { UiDropdownOption } from '~/components/ui/Dropdown.vue'
import type { UiSearchOption } from '~/components/ui/Search.vue'
import type { CatalogCardLayout } from '#shared/types/catalog'

export type CatalogFiltersVariant = 'shops' | 'cafes' | 'services'

type CatalogFilterTexts = {
  searchLabel: string
  searchPlaceholder: string
  categoryLabel: string
  categoryPlaceholder: string
}

const CATALOG_FILTER_TEXTS: Record<CatalogFiltersVariant, CatalogFilterTexts> = {
  shops: {
    searchLabel: 'Поиск магазина',
    searchPlaceholder: 'Найти магазин',
    categoryLabel: 'Категория',
    categoryPlaceholder: 'Категории',
  },
  services: {
    searchLabel: 'Поиск услуги',
    searchPlaceholder: 'Найти услугу',
    categoryLabel: 'Категория',
    categoryPlaceholder: 'Категории',
  },
  cafes: {
    searchLabel: 'Поиск кафе или ресторана',
    searchPlaceholder: 'Найти кафе или ресторан',
    categoryLabel: 'Тип кухни',
    categoryPlaceholder: 'Тип кухни',
  },
}

const props = withDefaults(
  defineProps<{
    variant?: CatalogFiltersVariant
    categoryOptions: UiDropdownOption[]
    floorOptions: UiDropdownOption[]
    searchOptions: UiSearchOption[]
  }>(),
  {
    variant: 'shops',
  },
)

const query = defineModel<string>('query', { default: '' })
const category = defineModel<string>('category', { default: '' })
const floor = defineModel<string>('floor', { default: '' })
const loyaltyOnly = defineModel<boolean>('loyaltyOnly', { default: false })
const actionsOnly = defineModel<boolean>('actionsOnly', { default: false })
const breakfastOnly = defineModel<boolean>('breakfastOnly', { default: false })
const businessLunchOnly = defineModel<boolean>('businessLunchOnly', { default: false })
const viewMode = defineModel<CatalogCardLayout>('viewMode', { default: 'card' })

const texts = computed(() => CATALOG_FILTER_TEXTS[props.variant])

const viewModes = [
  { mode: 'card' as const, icon: 'local:dashboard', label: 'Плитка' },
  { mode: 'list' as const, icon: 'local:list', label: 'Список' },
]
</script>

<template>
  <div :class="$style.toolbar">
    <div :class="$style.fields">
      <UiSearch
        v-model="query"
        :class="$style.search"
        :label="texts.searchLabel"
        :placeholder="texts.searchPlaceholder"
        :options="searchOptions"
      />

      <UiDropdown
        v-model="category"
        :label="texts.categoryLabel"
        :placeholder="texts.categoryPlaceholder"
        :options="categoryOptions"
      />

      <UiDropdown
        v-model="floor"
        :class="$style.floor"
        label="Этаж"
        placeholder="Все этажи"
        :options="floorOptions"
      />

      <div :class="$style.checks">
        <label :class="$style.checkbox">
          <UiCheckbox v-model="loyaltyOnly" />
          <span>Участник программы лояльности</span>
        </label>

        <label :class="$style.checkbox">
          <UiCheckbox v-model="actionsOnly" />
          <span>Доступные акции</span>
        </label>

        <label v-if="variant === 'cafes'" :class="$style.checkbox">
          <UiCheckbox v-model="breakfastOnly" />
          <span>Завтраки</span>
        </label>

        <label v-if="variant === 'cafes'" :class="$style.checkbox">
          <UiCheckbox v-model="businessLunchOnly" />
          <span>Бизнес-ланч</span>
        </label>
      </div>
    </div>

    <div :class="$style.view" role="group" aria-label="Вид каталога">
      <UiTab
        v-for="view in viewModes"
        :key="view.mode"
        variant="circle"
        :icon="view.icon"
        :selected="viewMode === view.mode"
        :aria-label="view.label"
        @click="viewMode = view.mode"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);

  @include from-desktop {
    flex-direction: row;
    gap: var(--fs-space-3);
    align-items: flex-start;
    justify-content: space-between;
  }
}

.fields {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include from-tablet {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  @include from-desktop {
    grid-template-columns: rem(440) rem(320) max-content;

    > .floor {
      width: max-content;
    }
  }
}

.search {
  @include from-tablet {
    grid-column: 1 / -1;
  }

  @include from-desktop {
    grid-column: auto;
  }
}

.floor {
  @include from-tablet {
    grid-column: span 1;
  }
}

.checks {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);

  @include from-tablet {
    grid-column: 1 / -1;
    flex-flow: row wrap;
    gap: var(--fs-space-3);
  }
}

.checkbox {
  display: inline-flex;
  gap: rem(12);
  align-items: flex-start;
  min-width: 0;
  @include fs-text-lg;
  color: var(--fs-color-black);
  cursor: pointer;
}

.view {
  display: inline-flex;
  flex-shrink: 0;
  gap: var(--fs-space-1);
  align-self: flex-start;
}
</style>
