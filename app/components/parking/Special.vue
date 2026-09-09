<script setup lang="ts">
import type {
  ParkingBenefitBlock,
  ParkingSpecialBlock,
} from '#shared/types/parking'

const { benefitsTitle, benefitGroups, special } = defineProps<{
  benefitsTitle: string
  benefitGroups: readonly ParkingBenefitBlock[]
  special: ParkingSpecialBlock
}>()
</script>

<template>
  <section :class="$style.root" aria-label="Льготы и специальные условия">
    <article :class="$style.card" aria-labelledby="parking-benefits-title">
      <h2 id="parking-benefits-title" :class="$style.title">
        {{ benefitsTitle }}
      </h2>

      <div
        v-for="group in benefitGroups"
        :key="group.id"
        :class="$style.group"
      >
        <h3 :class="$style.groupTitle">{{ group.title }}</h3>

        <div :class="$style.rates">
          <div
            v-for="rate in group.rates"
            :key="`${group.id}-${rate.label}`"
            :class="$style.rate"
          >
            <p :class="$style.rateLabel">{{ rate.label }}</p>
            <p :class="$style.rateValue">{{ rate.value }}</p>
          </div>
        </div>

        <p :class="$style.note">{{ group.note }}</p>
      </div>
    </article>

    <article :class="$style.card" aria-labelledby="parking-special-title">
      <h2 id="parking-special-title" :class="$style.title">
        {{ special.title }}
      </h2>

      <div :class="$style.group">
        <p :class="$style.specialDesc">{{ special.description }}</p>

        <div :class="$style.rates">
          <div
            v-for="rate in special.rates"
            :key="`special-${rate.label}`"
            :class="$style.rate"
          >
            <p :class="$style.rateLabel">{{ rate.label }}</p>
            <p :class="$style.rateValue">{{ rate.value }}</p>
          </div>
        </div>

        <div :class="$style.notes">
          <p
            v-for="(note, index) in special.notes"
            :key="`special-note-${index}`"
            :class="$style.note"
          >
            {{ note }}
          </p>
        </div>
      </div>
    </article>
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
    flex-direction: row;
    gap: var(--fs-space-3);
    align-items: stretch;
  }
}

.card {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: rem(32);
  min-width: 0;
  padding: var(--fs-space-4);
  overflow: clip;
  background-color: var(--fs-color-light);
  border-radius: rem(24);

  @include from-desktop {
    gap: rem(40);
    padding: rem(40);
    border-radius: rem(32);
  }
}

.title {
  @include fs-h2;
  margin: 0;
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
}

.groupTitle {
  margin: 0;
  @include fs-h4;
}

.specialDesc {
  margin: 0;
  @include fs-text-lg;
  overflow-wrap: break-word;
}

.rates {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);

  @include from-tablet {
    flex-direction: row;
    gap: rem(40);
  }

  @include from-desktop {
    gap: rem(56);
  }
}

.rate {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  min-width: 0;
}

.rateLabel {
  margin: 0;
  @include fs-text-lg;
}

.rateValue {
  margin: 0;
  @include fs-h4;
}

.notes {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.note {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
  overflow-wrap: break-word;
}
</style>
