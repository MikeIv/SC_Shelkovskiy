<script setup lang="ts">
interface HoursInterval {
  label: string
  open: string
  close: string
}

interface HoursTenant {
  name: string
  ranges: HoursInterval[]
}

const props = defineProps<{
  open: boolean
  anchor: HTMLElement | null
}>()

const emit = defineEmits<{
  close: []
}>()

const titleId = useId()
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

const mallDays: HoursInterval[] = [
  { label: 'Пн', open: '10:00', close: '22:00' },
  { label: 'Вт', open: '10:00', close: '22:00' },
  { label: 'Ср', open: '10:00', close: '22:00' },
  { label: 'Чт', open: '10:00', close: '22:00' },
  { label: 'Пт', open: '10:00', close: '23:00' },
  { label: 'Сб', open: '10:00', close: '23:00' },
  { label: 'Вс', open: '10:00', close: '22:00' },
]

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

/** Пн = 0 … Вс = 6 */
const todayIndex = computed(() => (new Date().getDay() + 6) % 7)

function close(): void {
  emit('close')
}

function updatePosition(): void {
  if (!import.meta.client || !props.anchor) {
    return
  }

  const rect = props.anchor.getBoundingClientRect()
  panelStyle.value = {
    top: `${Math.round(rect.bottom + 16)}px`,
    left: `${Math.round(rect.left)}px`,
  }
}

function onDocumentPointerDown(event: Event): void {
  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (panelRef.value?.contains(target) || props.anchor?.contains(target)) {
    return
  }

  close()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function bindListeners(bind: boolean): void {
  if (!import.meta.client) {
    return
  }

  if (bind) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    document.addEventListener('keydown', onKeydown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
}

watch(
  () => [props.open, props.anchor] as const,
  async ([isOpen]) => {
    if (!import.meta.client) {
      return
    }

    bindListeners(false)

    if (!isOpen) {
      return
    }

    updatePosition()
    bindListeners(true)
    await nextTick()
    updatePosition()
  },
)

onBeforeUnmount(() => {
  bindListeners(false)
})
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <LayoutPopupBackdrop @close="close" />
      <div
        ref="panelRef"
        :class="$style.panel"
        :style="panelStyle"
        role="dialog"
        :aria-labelledby="titleId"
      >
        <section :class="$style.card">
          <div :class="$style.media">
            <img
              :class="$style.mediaImg"
              src="/images/layout/hours-mall.png"
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

        <section :class="$style.card" aria-label="Время работы арендаторов">
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
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.panel {
  position: fixed;
  z-index: z('dropdown-panel');
  display: flex;
  flex-direction: column;
  width: min(100% - var(--fs-grid-margin) * 2, #{rem(515)});
  max-height: calc(100vh - #{rem(24)});
  overflow: auto;
}

.card {
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
  width: 100%;
  aspect-ratio: 451 / 208;
  overflow: hidden;
  border-radius: var(--fs-radius-xl);
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
  @include fs-text-lg;
  font-weight: 500;
  color: var(--fs-color-black);
}

.days {
  display: flex;
  flex-wrap: nowrap;
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
  border-radius: var(--fs-radius-xl);
  @include fs-text-lg;
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
  gap: var(--fs-space-4) rem(56);
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
  @include fs-text-lg;
  color: var(--fs-color-black);
}

.rangeLabel {
  color: var(--fs-color-gray);
}
</style>
