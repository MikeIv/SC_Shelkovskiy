<script setup lang="ts">
import type {
  SchemeAmenityKind,
  SchemeFloorPlan,
  SchemeUnit,
} from '#shared/types/scheme'

const props = withDefaults(
  defineProps<{
    floor: SchemeFloorPlan
    activeAmenity?: SchemeAmenityKind | null
    highlightedUnitId?: string | null
  }>(),
  {
    activeAmenity: null,
    highlightedUnitId: null,
  },
)

const emit = defineEmits<{
  'select-unit': [unit: SchemeUnit]
}>()

const amenityIcon: Record<SchemeAmenityKind, string> = {
  toilet: 'local:toilet',
  'mother-child': 'local:mother-child',
  cloakroom: 'local:cloakroom',
  atm: 'local:atm',
  parking: 'local:parking',
}

const hasBackground = computed(() => Boolean(props.floor.backgroundSrc))

type UnitView = {
  unit: SchemeUnit
  points: string
  labelX: number
  labelY: number
  showLabel: boolean
}

const unitViews = computed((): UnitView[] => {
  const withBg = hasBackground.value
  const highlighted = props.highlightedUnitId

  return props.floor.units.map((unit) => {
    const xs = unit.coordinates.map((point) => point.x)
    const ys = unit.coordinates.map((point) => point.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    return {
      unit,
      points: unit.coordinates.map((point) => `${point.x},${point.y}`).join(' '),
      labelX: (minX + maxX) / 2,
      labelY: (minY + maxY) / 2,
      showLabel:
        !withBg || highlighted === unit.id || unit.status === 'coming-soon',
    }
  })
})

const visibleAmenities = computed(() => {
  const kind = props.activeAmenity
  if (!kind) {
    return props.floor.amenities
  }

  return props.floor.amenities.filter((marker) => marker.kind === kind)
})
</script>

<template>
  <div
    :class="$style.root"
    :aria-label="floor.backgroundAlt ?? `Этаж ${floor.label}`"
  >
    <img
      v-if="floor.backgroundSrc"
      :class="$style.bg"
      :src="floor.backgroundSrc"
      :alt="floor.backgroundAlt ?? ''"
      width="1560"
      height="600"
      decoding="async"
    >

    <svg
      :class="$style.svg"
      :viewBox="`0 0 ${floor.width} ${floor.height}`"
      role="group"
      aria-label="Помещения на схеме"
    >
      <rect
        v-if="!hasBackground"
        x="0"
        y="0"
        :width="floor.width"
        :height="floor.height"
        fill="var(--fs-color-white)"
      />

      <g
        v-for="{ unit, points, labelX, labelY, showLabel } in unitViews"
        :key="unit.id"
        :class="$style.unit"
        :data-active="highlightedUnitId === unit.id ? 'true' : undefined"
        :data-status="unit.status ?? 'open'"
        :data-has-bg="hasBackground ? 'true' : undefined"
        role="button"
        tabindex="0"
        :aria-label="`${unit.name}, ${unit.areaSqm} м²`"
        @click="emit('select-unit', unit)"
        @keydown.enter.prevent="emit('select-unit', unit)"
        @keydown.space.prevent="emit('select-unit', unit)"
      >
        <polygon :points="points" />
        <text
          v-if="showLabel"
          :x="labelX"
          :y="labelY"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ unit.name }}
        </text>
      </g>
    </svg>

    <ul :class="$style.amenities" aria-hidden="true">
      <li
        v-for="marker in visibleAmenities"
        :key="marker.id"
        :class="$style.amenity"
        :data-active="activeAmenity === marker.kind ? 'true' : undefined"
        :style="{
          left: `${(marker.x / floor.width) * 100}%`,
          top: `${(marker.y / floor.height) * 100}%`,
        }"
      >
        <UIcon
          :name="amenityIcon[marker.kind]"
          :class="$style.amenityIcon"
          aria-hidden="true"
        />
      </li>
    </ul>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  width: 100%;
  overflow: clip;
  aspect-ratio: 1560 / 600;
  background-color: var(--fs-color-white);
  border-radius: rem(24);

  @include from-desktop {
    border-radius: rem(60);
  }
}

.bg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.unit {
  cursor: pointer;
  outline: none;

  polygon {
    fill: color-mix(in srgb, var(--fs-color-light) 72%, transparent);
    stroke: var(--fs-color-white);
    stroke-width: 2;
    transition:
      fill 0.2s ease,
      stroke 0.2s ease;
  }

  text {
    @include fs-text-sm;
    fill: var(--fs-color-black);
    pointer-events: none;
    paint-order: stroke;
    stroke: color-mix(in srgb, var(--fs-color-white) 80%, transparent);
    stroke-width: 3px;
  }

  &[data-has-bg='true'] polygon {
    fill: transparent;
    stroke: transparent;
  }

  &[data-has-bg='true'][data-active='true'] polygon,
  &[data-has-bg='true']:focus-visible polygon {
    fill: color-mix(in srgb, var(--fs-color-beige) 45%, transparent);
    stroke: var(--fs-color-beige);
  }

  &:not([data-has-bg='true']):focus-visible polygon,
  &[data-active='true']:not([data-has-bg='true']) polygon {
    fill: color-mix(in srgb, var(--fs-color-beige) 85%, transparent);
    stroke: var(--fs-color-beige);
  }

  &[data-status='coming-soon']:not([data-has-bg='true']) polygon {
    fill: color-mix(in srgb, var(--fs-color-gray) 28%, transparent);
  }

  @media (hover: hover) {
    &[data-has-bg='true']:hover polygon {
      fill: color-mix(in srgb, var(--fs-color-beige) 45%, transparent);
      stroke: var(--fs-color-beige);
    }

    &:not([data-has-bg='true']):hover polygon {
      fill: color-mix(in srgb, var(--fs-color-beige) 85%, transparent);
      stroke: var(--fs-color-beige);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    polygon {
      transition: none;
    }
  }
}

.amenities {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: none;
}

.amenity {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(36);
  height: rem(36);
  border: rem(2) solid var(--fs-color-light);
  border-radius: 50%;
  background-color: var(--fs-color-white);
  opacity: 0.85;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;

  @include from-desktop {
    width: rem(44);
    height: rem(44);
  }

  &[data-active='true'] {
    opacity: 1;
    border-color: var(--fs-color-beige);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.amenityIcon {
  display: block;
  width: rem(18);
  height: rem(18);
  color: var(--fs-color-black);

  @include from-desktop {
    width: rem(24);
    height: rem(24);
  }
}
</style>
