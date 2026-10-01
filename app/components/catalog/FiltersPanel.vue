<script setup lang="ts">
import type { UiDropdownOption } from '~/components/ui/Dropdown.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    categoryOptions: UiDropdownOption[]
    floorOptions: UiDropdownOption[]
    showCafeFilters?: boolean
  }>(),
  {
    showCafeFilters: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

const category = defineModel<string>('category', { default: '' })
const floor = defineModel<string>('floor', { default: '' })
const loyaltyOnly = defineModel<boolean>('loyaltyOnly', { default: false })
const actionsOnly = defineModel<boolean>('actionsOnly', { default: false })
const breakfastOnly = defineModel<boolean>('breakfastOnly', { default: false })
const businessLunchOnly = defineModel<boolean>('businessLunchOnly', { default: false })

const titleId = useId()
const rootRef = ref<HTMLElement | null>(null)
const closeRef = ref<HTMLButtonElement | null>(null)

const draftCategory = ref('')
const draftFloor = ref('')
const draftLoyaltyOnly = ref(false)
const draftActionsOnly = ref(false)
const draftBreakfastOnly = ref(false)
const draftBusinessLunchOnly = ref(false)

const floorChoices = computed(() =>
  props.floorOptions.filter((option) => option.value !== ''),
)
const allFloorsOption = computed(
  () => props.floorOptions.find((option) => option.value === '') ?? null,
)

useDialogFocus({
  open: () => props.open,
  container: rootRef,
  initialFocus: closeRef,
})

function floorChipLabel(label: string): string {
  return label.replace(/\s*этаж$/i, '').trim() || label
}

function syncDraftFromModels(): void {
  draftCategory.value = category.value
  draftFloor.value = floor.value
  draftLoyaltyOnly.value = loyaltyOnly.value
  draftActionsOnly.value = actionsOnly.value
  draftBreakfastOnly.value = breakfastOnly.value
  draftBusinessLunchOnly.value = businessLunchOnly.value
}

function close(): void {
  emit('close')
}

function apply(): void {
  category.value = draftCategory.value
  floor.value = draftFloor.value
  loyaltyOnly.value = draftLoyaltyOnly.value
  actionsOnly.value = draftActionsOnly.value
  breakfastOnly.value = draftBreakfastOnly.value
  businessLunchOnly.value = draftBusinessLunchOnly.value
  close()
}

function reset(): void {
  draftCategory.value = ''
  draftFloor.value = ''
  draftLoyaltyOnly.value = false
  draftActionsOnly.value = false
  draftBreakfastOnly.value = false
  draftBusinessLunchOnly.value = false
}

function lockScroll(lock: boolean): void {
  if (!import.meta.client) {
    return
  }

  document.documentElement.style.overflow = lock ? 'hidden' : ''
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
    document.addEventListener('keydown', onKeydown)
    return
  }

  document.removeEventListener('keydown', onKeydown)
}

watch(
  () => props.open,
  (isOpen) => {
    if (!import.meta.client) {
      return
    }

    bindListeners(false)

    if (!isOpen) {
      lockScroll(false)
      return
    }

    syncDraftFromModels()
    lockScroll(true)
    bindListeners(true)
  },
)

onBeforeUnmount(() => {
  bindListeners(false)
  lockScroll(false)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="rootRef"
      :class="$style.root"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <header :class="$style.header">
        <h2 :id="titleId" :class="$style.title">Фильтры</h2>
        <button
          ref="closeRef"
          :class="$style.close"
          type="button"
          aria-label="Закрыть фильтры"
          @click="close"
        >
          <UIcon name="local:cross" :class="$style.closeIcon" aria-hidden="true" />
        </button>
      </header>

      <div :class="$style.body">
        <section :class="$style.section" aria-label="Категории">
          <h3 :class="$style.sectionTitle">Категории</h3>
          <ul :class="$style.categoryList">
            <li
              v-for="option in categoryOptions"
              :key="`category-${option.value || 'all'}`"
            >
              <button
                type="button"
                :class="$style.categoryOption"
                :aria-pressed="draftCategory === option.value"
                @click="draftCategory = option.value"
              >
                {{ option.label }}
              </button>
            </li>
          </ul>
        </section>

        <hr :class="$style.divider">

        <section :class="$style.section" aria-label="Этаж">
          <h3 :class="$style.sectionTitle">Этаж</h3>
          <div :class="$style.floorBlock">
            <button
              v-if="allFloorsOption"
              type="button"
              :class="$style.categoryOption"
              :aria-pressed="draftFloor === ''"
              @click="draftFloor = ''"
            >
              {{ allFloorsOption.label }}
            </button>

            <div :class="$style.floorChips" role="group" aria-label="Номер этажа">
              <button
                v-for="option in floorChoices"
                :key="`floor-${option.value}`"
                type="button"
                :class="$style.floorChip"
                :aria-pressed="draftFloor === option.value"
                @click="draftFloor = option.value"
              >
                {{ floorChipLabel(option.label) }}
              </button>
            </div>
          </div>
        </section>

        <hr :class="$style.divider">

        <div :class="$style.checks">
          <label :class="$style.checkbox">
            <UiCheckbox v-model="draftLoyaltyOnly" />
            <span>Участник программы лояльности</span>
          </label>

          <label :class="$style.checkbox">
            <UiCheckbox v-model="draftActionsOnly" />
            <span>Доступные акции</span>
          </label>

          <label v-if="showCafeFilters" :class="$style.checkbox">
            <UiCheckbox v-model="draftBreakfastOnly" />
            <span>Завтраки</span>
          </label>

          <label v-if="showCafeFilters" :class="$style.checkbox">
            <UiCheckbox v-model="draftBusinessLunchOnly" />
            <span>Бизнес-ланч</span>
          </label>
        </div>
      </div>

      <footer :class="$style.footer">
        <UiButton :class="$style.apply" type="button" @click="apply">
          Применить
        </UiButton>
        <button :class="$style.reset" type="button" @click="reset">
          Сбросить
        </button>
      </footer>
    </div>
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: fixed;
  inset: 0;
  z-index: z('modal');
  display: flex;
  flex-direction: column;
  background-color: var(--fs-color-white);
}

.header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: rem(28) var(--fs-grid-margin) var(--fs-space-3);
}

.title {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
}

.close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--fs-color-black);
  background: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.closeIcon {
  width: rem(24);
  height: rem(24);
}

.body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-height: 0;
  padding: 0 var(--fs-grid-margin);
  overflow: hidden auto;
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.sectionTitle {
  margin: 0;
  @include fs-h3;
  color: var(--fs-color-black);
}

.categoryList {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.categoryOption {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
  text-align: start;
  background: transparent;
  cursor: pointer;
  appearance: none;

  &[aria-pressed='true'] {
    color: var(--fs-color-black);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.floorBlock {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
}

.floorChips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-1);
}

.floorChip {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: rem(2) solid var(--fs-color-white);
  border-radius: rem(100);
  @include fs-text-md;
  color: var(--fs-color-black);
  background-color: var(--fs-color-light);
  cursor: pointer;
  appearance: none;

  &[aria-pressed='true'] {
    color: var(--fs-color-white);
    background-color: var(--fs-color-black);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.divider {
  width: 100%;
  height: 0;
  margin: 0;
  border: 0;
  border-top: rem(1) solid var(--fs-color-light);
}

.checks {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
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

.footer {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: center;
  padding: var(--fs-space-3) var(--fs-grid-margin) var(--fs-space-4);
}

.apply {
  width: 100%;
}

.reset {
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  text-align: center;
  background: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}
</style>
