<script setup lang="ts">
import { mallHoursTodayIndex, mallOpenHours } from '~/data/mallHours'

interface HoursInterval {
  label: string
  open: string
  close: string
}

interface HoursTenant {
  name: string
  ranges: HoursInterval[]
}

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

/** Обход Nuxt `virtual:public` + Vite HMR (`?t=&path` → `/&/images/...`). */
const hoursMallSrc = ['', 'images', 'layout', 'hours-mall.png'].join('/')

const mallDays: HoursInterval[] = [...mallOpenHours]

const tenants: HoursTenant[] = [
  {
    name: 'Перекресток',
    ranges: [{ label: 'Пн-Вс', open: '07:00', close: '23:00' }],
  },
  {
    name: 'КиноОККО',
    ranges: [{ label: 'Пн-Вс', open: '10:00', close: '02:00' }],
  },
  {
    name: 'Аптека Доктор Столетов',
    ranges: [{ label: 'Пн-Вс', open: '09:00', close: '23:00' }],
  },
  {
    name: 'World class',
    ranges: [
      { label: 'Пн-Пт', open: '07:00', close: '00:00' },
      { label: 'Сб-Вс', open: '09:00', close: '00:00' },
    ],
  },
]

const todayIndex = computed(() => mallHoursTodayIndex())
</script>

<template>
  <div
    :class="[$style.root, variant === 'embedded' ? $style.embedded : $style.carded]"
    role="region"
    :aria-labelledby="titleId"
  >
    <section :class="$style.mall">
      <div :class="$style.media">
        <img
          :class="$style.mediaImg"
          :src="hoursMallSrc"
          alt="ТРЦ Щёлковский"
          width="902"
          height="416"
          decoding="async"
        >
      </div>
      <div :class="$style.mallBlock">
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
      </div>
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

.carded {
  .mall,
  .tenantsSection {
    display: flex;
    flex-direction: column;
    gap: var(--fs-space-2);
    padding: var(--fs-space-3);
    border-radius: rem(32);
    background-color: var(--fs-color-white);

    @include from-desktop {
      padding: var(--fs-space-4);
    }
  }

  .media {
    aspect-ratio: 451 / 208;
    border-radius: var(--fs-radius-xl);
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
  .mall {
    display: flex;
    flex-direction: column;
    gap: var(--fs-space-2);
  }

  .media {
    height: rem(158);
    border-radius: var(--fs-radius-xl);
  }

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

  .tenants {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--fs-space-4);
  }

  .media {
    flex-shrink: 0;
  }
}

.media {
  width: 100%;
  overflow: hidden;
}

.mediaImg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.mallBlock {
  display: flex;
  flex-direction: column;
  gap: rem(10);
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
  display: flex;
  flex-wrap: wrap;
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
