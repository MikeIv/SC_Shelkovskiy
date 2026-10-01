<script setup lang="ts">
import type { UiDropdownOption } from '~/components/ui/Dropdown.vue'
import type { UiSearchOption } from '~/components/ui/Search.vue'
import type { CatalogCardLayout } from '#shared/types/catalog'

export type CatalogFiltersVariant = 'shops' | 'cafes' | 'services' | 'entertainment'

type CatalogFilterTexts = {
  searchLabel: string
  searchPlaceholder: string
  categoryLabel: string
  categoryPlaceholder: string
}

const DEFAULT_CATEGORY_TEXTS = {
  categoryLabel: 'Категория',
  categoryPlaceholder: 'Все категории',
} as const satisfies Pick<CatalogFilterTexts, 'categoryLabel' | 'categoryPlaceholder'>

const CATALOG_FILTER_TEXTS: Record<CatalogFiltersVariant, CatalogFilterTexts> = {
  shops: {
    searchLabel: 'Поиск магазина',
    searchPlaceholder: 'Найти магазин',
    ...DEFAULT_CATEGORY_TEXTS,
  },
  cafes: {
    searchLabel: 'Поиск кафе или ресторана',
    searchPlaceholder: 'Найти кафе или ресторан',
    categoryLabel: 'Тип кухни',
    categoryPlaceholder: 'Тип кухни',
  },
  services: {
    searchLabel: 'Поиск услуги',
    searchPlaceholder: 'Найти услугу',
    ...DEFAULT_CATEGORY_TEXTS,
  },
  entertainment: {
    searchLabel: 'Поиск спорта или развлечения',
    searchPlaceholder: 'Найти спорт или развлечения',
    ...DEFAULT_CATEGORY_TEXTS,
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

const filtersOpen = ref(false)
const texts = computed(() => CATALOG_FILTER_TEXTS[props.variant])

const hasActiveFilters = computed(
  () =>
    Boolean(category.value) ||
    Boolean(floor.value) ||
    loyaltyOnly.value ||
    actionsOnly.value ||
    breakfastOnly.value ||
    businessLunchOnly.value,
)

const viewModes = [
  { mode: 'card' as const, icon: 'local:dashboard', label: 'Плитка' },
  { mode: 'list' as const, icon: 'local:list', label: 'Список' },
]

function openFilters(): void {
  filtersOpen.value = true
}

function closeFilters(): void {
  filtersOpen.value = false
}
</script>

<template>
  <div :class="$style.toolbar">
    <UiSearch
      v-model="query"
      :class="$style.search"
      :label="texts.searchLabel"
      :placeholder="texts.searchPlaceholder"
      :options="searchOptions"
    />

    <div :class="$style.actions">
      <UiTab
        :class="$style.filterBtn"
        variant="circle"
        icon="local:filter"
        :selected="hasActiveFilters || filtersOpen"
        aria-label="Фильтры"
        :aria-expanded="filtersOpen"
        aria-haspopup="dialog"
        @click="openFilters"
      />

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

    <div :class="$style.desktopFields">
      <UiDropdown
        v-model="category"
        :class="$style.category"
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

    <CatalogFiltersPanel
      v-model:category="category"
      v-model:floor="floor"
      v-model:loyalty-only="loyaltyOnly"
      v-model:actions-only="actionsOnly"
      v-model:breakfast-only="breakfastOnly"
      v-model:business-lunch-only="businessLunchOnly"
      :open="filtersOpen"
      :category-options="categoryOptions"
      :floor-options="floorOptions"
      :show-cafe-filters="variant === 'cafes'"
      @close="closeFilters"
    />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;

  @include from-desktop {
    display: grid;
    grid-template-columns: rem(440) rem(320) max-content 1fr;
    gap: var(--fs-space-3);
    align-items: start;
  }
}

.search {
  width: 100%;

  @include from-desktop {
    grid-column: 1;
    grid-row: 1;
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @include from-desktop {
    grid-column: 4;
    grid-row: 1;
    gap: var(--fs-space-1);
    justify-content: flex-end;
    justify-self: end;
    width: auto;
  }
}

.filterBtn {
  @include from-desktop {
    display: none;
  }
}

.view {
  display: inline-flex;
  flex-shrink: 0;
  gap: var(--fs-space-1);
  align-items: center;
}

.desktopFields {
  display: none;

  @include from-desktop {
    display: contents;
  }
}

.category {
  @include from-desktop {
    grid-column: 2;
    grid-row: 1;
  }
}

.floor {
  @include from-desktop {
    grid-column: 3;
    grid-row: 1;
    width: max-content;
  }
}

.checks {
  display: flex;
  flex-flow: row wrap;
  gap: var(--fs-space-3);

  @include from-desktop {
    grid-column: 1 / -1;
    grid-row: 2;
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
</style>
