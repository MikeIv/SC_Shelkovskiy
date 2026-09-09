<script setup lang="ts">
import type { UiSearchOption } from '~/components/ui/Search.vue'
import type {
  SchemeAmenityKind,
  SchemeMode,
  SchemePageContent,
  SchemeUnit,
} from '#shared/types/scheme'
import { flattenSchemeUnits } from '~/data/schemePage'

const props = defineProps<{
  content: SchemePageContent
}>()

const route = useRoute()

const mode = ref<SchemeMode>(props.content.modes[0]?.id ?? 'mall')
const query = ref('')
const activeAmenity = ref<SchemeAmenityKind | null>(null)
const activeFloorId = ref(props.content.defaultMallFloorId)
const highlightedUnitId = ref<string | null>(null)

const floors = computed(() =>
  mode.value === 'mall' ? props.content.mallFloors : props.content.parkingFloors,
)

const activeFloor = computed(
  () => floors.value.find((floor) => floor.id === activeFloorId.value) ?? floors.value[0]!,
)

const searchOptions = computed((): UiSearchOption[] =>
  flattenSchemeUnits(floors.value)
    .filter(({ unit }) => unit.status !== 'coming-soon')
    .map(({ unit }) => ({
      value: unit.id,
      label: unit.name,
    })),
)

watch(mode, (next) => {
  activeFloorId.value =
    next === 'mall'
      ? props.content.defaultMallFloorId
      : props.content.defaultParkingFloorId
  highlightedUnitId.value = null
  activeAmenity.value = null
  query.value = ''
})

function focusUnit(unitId: string): void {
  const match = flattenSchemeUnits(floors.value).find(({ unit }) => unit.id === unitId)
  if (!match) {
    return
  }

  highlightedUnitId.value = match.unit.id
  activeFloorId.value = match.floorId
  query.value = match.unit.name
}

function onFloorSelect(floorId: string): void {
  if (activeFloorId.value === floorId) {
    return
  }

  activeFloorId.value = floorId

  const highlighted = highlightedUnitId.value
  if (
    highlighted &&
    !floors.value
      .find((floor) => floor.id === floorId)
      ?.units.some((unit) => unit.id === highlighted)
  ) {
    highlightedUnitId.value = null
  }
}

function onSearchSelect(option: UiSearchOption): void {
  focusUnit(option.value)
}

function onSelectUnit(unit: SchemeUnit): void {
  highlightedUnitId.value = unit.id
  query.value = unit.name
}

function toggleAmenity(kind: SchemeAmenityKind): void {
  activeAmenity.value = activeAmenity.value === kind ? null : kind
}

function applyTenantFromQuery(): void {
  const raw = route.query.tenant
  const tenantId = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : ''
  if (!tenantId) {
    return
  }

  mode.value = 'mall'
  focusUnit(tenantId)
}

watch(() => route.query.tenant, applyTenantFromQuery, { immediate: true })
</script>

<template>
  <section :class="$style.root" aria-labelledby="scheme-title">
    <h1 id="scheme-title" :class="$style.srOnly">{{ content.title }}</h1>

    <div :class="$style.toolbar">
      <UiSearch
        v-model="query"
        :class="$style.search"
        :label="content.searchPlaceholder"
        :placeholder="content.searchPlaceholder"
        :options="searchOptions"
        @select="onSearchSelect"
      />

      <div :class="$style.modes" role="group" aria-label="Тип схемы">
        <UiTab
          v-for="item in content.modes"
          :key="item.id"
          :selected="mode === item.id"
          @click="mode = item.id"
        >
          {{ item.label }}
        </UiTab>
      </div>
    </div>

    <div :class="$style.mapBlock">
      <div :class="$style.mapWrap">
        <SchemeMap
          :floor="activeFloor"
          :active-amenity="activeAmenity"
          :highlighted-unit-id="highlightedUnitId"
          @select-unit="onSelectUnit"
        />

        <div
          :class="$style.floors"
          role="group"
          :aria-label="mode === 'mall' ? 'Этажи ТРЦ' : 'Этажи парковки'"
        >
          <button
            v-for="floor in floors"
            :key="floor.id"
            type="button"
            :class="$style.floor"
            :aria-pressed="activeFloorId === floor.id"
            :data-active="activeFloorId === floor.id ? 'true' : undefined"
            @click="onFloorSelect(floor.id)"
          >
            {{ floor.label }}
          </button>
        </div>
      </div>

      <div :class="$style.amenities" role="group" aria-label="Удобства на схеме">
        <UiTab
          v-for="item in content.amenities"
          :key="item.id"
          :icon="item.icon"
          :selected="activeAmenity === item.id"
          @click="toggleAmenity(item.id)"
        >
          {{ item.label }}
        </UiTab>
      </div>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include from-desktop {
    gap: rem(40);
  }
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;

  @include from-desktop {
    flex-direction: row;
    gap: var(--fs-space-3);
    align-items: center;
    justify-content: space-between;
  }
}

.search {
  width: 100%;

  @include from-desktop {
    flex: 0 1 rem(440);
    max-width: rem(440);
  }
}

.modes {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  align-items: center;
  min-width: 0;
}

.mapBlock {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include from-desktop {
    gap: rem(24);
  }
}

.mapWrap {
  position: relative;
  width: 100%;
  min-width: 0;
}

.floors {
  position: absolute;
  top: 50%;
  right: var(--fs-space-1);
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: rem(4);
  transform: translateY(-50%);

  @include from-desktop {
    right: rem(16);
  }
}

.floor {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(40);
  height: rem(40);
  margin: 0;
  padding: 0;
  border: rem(2) solid var(--fs-color-white);
  border-radius: 50%;
  @include fs-text-md;
  color: var(--fs-color-black);
  background-color: var(--fs-color-light);
  cursor: pointer;
  appearance: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  @include from-desktop {
    width: rem(58);
    height: rem(58);
  }

  &[data-active='true'] {
    color: var(--fs-color-white);
    background-color: var(--fs-color-black);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2);
  align-items: center;
  justify-content: flex-start;
  min-width: 0;

  @include from-desktop {
    gap: rem(24);
    justify-content: center;
  }
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
