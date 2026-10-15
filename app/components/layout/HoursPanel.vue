<script setup lang="ts">
import { layoutDisplayWeek, layoutTodayIndex } from '#shared/utils/layoutHours'

withDefaults(
  defineProps<{
    /** card — белые карточки (dropdown); embedded — на beige chrome меню */
    variant?: 'card' | 'embedded'
  }>(),
  {
    variant: 'card',
  },
)

const titleId = useId()

const layout = useLayoutStore()
const mallDays = computed(() => layoutDisplayWeek(layout.hours))
const tenants = computed(() => layout.hours.tenants)
const todayIndex = computed(() => layoutTodayIndex(layout.hours))
</script>

<template>
  <div
    :class="[$style.root, variant === 'embedded' ? $style.embedded : $style.carded]"
    role="region"
    :aria-labelledby="titleId"
  >
    <section :class="$style.mall">
      <h2 :id="titleId" :class="$style.title">
        Время работы ТРЦ
      </h2>
      <ul :class="$style.days" aria-label="Расписание по дням недели">
        <li
          v-for="(day, index) in mallDays"
          :key="day.label"
          :class="[$style.day, { [$style.dayActive]: index === todayIndex }]"
        >
          <span :class="$style.dayLabel">{{ day.label }}</span>
          <span :class="$style.dayTimes">
            <span>{{ day.open }}</span>
            <span>{{ day.close }}</span>
          </span>
        </li>
      </ul>
    </section>

    <section :class="$style.tenantsSection" aria-label="Время работы арендаторов">
      <ul :class="$style.tenants">
        <li
          v-for="tenant in tenants"
          :key="tenant.name"
          :class="$style.tenant"
        >
          <p :class="$style.tenantName">
            {{ tenant.name }}
          </p>
          <div :class="$style.ranges">
            <div
              v-for="range in tenant.ranges"
              :key="`${tenant.name}-${range.label}`"
              :class="$style.range"
            >
              <span :class="$style.rangeLabel">{{ range.label }}</span>
              <span :class="$style.rangeTimes">
                <span>{{ range.open }}</span>
                <span>{{ range.close }}</span>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
}

.mall {
  display: flex;
  flex-direction: column;
  gap: rem(10);
}

.carded {
  gap: 0;

  .mall,
  .tenantsSection {
    padding: var(--fs-space-3);
    border-radius: rem(32);
    background-color: var(--fs-color-white);

    @include from-desktop {
      padding: var(--fs-space-4);
    }
  }

  .title,
  .tenantName {
    @include fs-text-lg;
    font-weight: 500;
  }

  .day,
  .range {
    @include fs-text-lg;
  }

  .day {
    border-radius: var(--fs-radius-xl);
  }

  .tenants {
    gap: var(--fs-space-4) rem(56);
  }
}

.embedded {
  .title,
  .tenantName {
    @include fs-text-md;
  }

  .day,
  .range {
    @include fs-type(var(--fs-font-sans), var(--fs-text-sm-size), 400, 1.25);
  }

  .day {
    border-radius: var(--fs-radius-md);
  }

  .day:not(.dayActive) {
    padding-block: var(--fs-space-1);
    padding-inline: 0;
  }
}

.title,
.tenantName {
  margin: 0;
  color: var(--fs-color-black);
}

.days {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: rem(4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.day {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  padding: var(--fs-space-1);
  color: var(--fs-color-black);
}

.dayLabel {
  color: var(--fs-color-gray);
}

.dayTimes,
.rangeTimes {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  color: var(--fs-color-black);
  white-space: nowrap;
}

.dayActive {
  color: var(--fs-color-white);
  background-color: var(--fs-color-black);

  .dayLabel,
  .dayTimes {
    color: var(--fs-color-white);
  }
}

.tenants {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--fs-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.tenant {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  min-width: 0;
}

.ranges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2);
}

.range {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  color: var(--fs-color-black);
}

.rangeLabel {
  color: var(--fs-color-gray);
}
</style>
