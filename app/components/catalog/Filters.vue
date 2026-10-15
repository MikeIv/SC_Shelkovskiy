<script setup lang="ts">
import type { UiDropdownOption } from '~/components/ui/Dropdown.vue'
import type { UiSearchOption } from '~/components/ui/Search.vue'
import type { CatalogCardLayout } from '#shared/types/catalog'
import {
  catalogFilterTexts,
  type CatalogFiltersVariant,
} from '#shared/utils/catalogFilterTexts'

export type { CatalogFiltersVariant }

const DESKTOP_MQ = '(min-width: 1280px)'
const TITLE_ASIDE_SELECTOR = '[data-fs-title-aside]'

const props = withDefaults(
  defineProps<{
    variant?: CatalogFiltersVariant
    categoryOptions: UiDropdownOption[]
    floorOptions: UiDropdownOption[]
    searchOptions: UiSearchOption[]
    showBreakfast?: boolean
    showBusinessLunch?: boolean
  }>(),
  {
    variant: 'shops',
    showBreakfast: false,
    showBusinessLunch: false,
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
const isDesktop = ref(false)
const texts = computed(() => catalogFilterTexts(props.variant))

/** Desktop + хост в LayoutInnerPage (`with-title-aside`) → поиск у заголовка. */
const searchInTitle = computed(
  () =>
    import.meta.client &&
    isDesktop.value &&
    Boolean(document.querySelector(TITLE_ASIDE_SELECTOR)),
)

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

function syncDesktop(): void {
  if (!import.meta.client) {
    return
  }

  isDesktop.value = window.matchMedia(DESKTOP_MQ).matches
}

function openFilters(): void {
  filtersOpen.value = true
}

function closeFilters(): void {
  filtersOpen.value = false
}

let desktopMq: MediaQueryList | undefined

onMounted(() => {
  syncDesktop()
  desktopMq = window.matchMedia(DESKTOP_MQ)
  desktopMq.addEventListener('change', syncDesktop)
})

onUnmounted(() => {
  desktopMq?.removeEventListener('change', syncDesktop)
})
</script>

<template>
  <div :class="$style.toolbar">
    <Teleport :to="TITLE_ASIDE_SELECTOR" :disabled="!searchInTitle">
      <UiSearch
        v-model="query"
        :class="$style.search"
        :label="texts.searchLabel"
        :placeholder="texts.searchPlaceholder"
        :options="searchOptions"
      />
    </Teleport>

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

        <label v-if="showBreakfast" :class="$style.checkbox">
          <UiCheckbox v-model="breakfastOnly" />
          <span>Завтраки</span>
        </label>

        <label v-if="showBusinessLunch" :class="$style.checkbox">
          <UiCheckbox v-model="businessLunchOnly" />
          <span>Бизнес-ланч</span>
        </label>
      </div>
    </div>

    <div :class="$style.actions">
      <UiTab
        :class="$style.filterBtn"
        :data-active="hasActiveFilters || undefined"
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
      :show-breakfast="showBreakfast"
      :show-business-lunch="showBusinessLunch"
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
    flex-direction: row;
    gap: var(--fs-space-3);
    align-items: center;
    justify-content: space-between;
  }
}

.search {
  width: 100%;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @include from-desktop {
    gap: var(--fs-space-1);
    justify-content: flex-end;
    width: auto;
  }
}

.filterBtn {
  @include from-desktop {
    display: none;
  }

  &[data-active]::after {
    content: '';
    position: absolute;
    top: rem(2);
    right: rem(2);
    width: rem(10);
    height: rem(10);
    border-radius: 50%;
    background-color: var(--fs-color-red);
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
    display: flex;
    flex: 1 1 auto;
    flex-wrap: wrap;
    gap: var(--fs-space-3);
    align-items: center;
    min-width: 0;
  }
}

.category {
  @include from-desktop {
    width: rem(320);
  }
}

.floor {
  @include from-desktop {
    width: max-content;
  }
}

.checks {
  display: flex;
  flex-flow: row wrap;
  gap: var(--fs-space-3);
  align-items: center;
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
