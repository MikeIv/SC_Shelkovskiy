<script setup lang="ts">
export type UiDropdownVariant = 'light' | 'white'

export interface UiDropdownOption {
  value: string
  label: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: UiDropdownVariant
    error?: string
    label?: string
    placeholder?: string
    options?: readonly UiDropdownOption[]
  }>(),
  {
    variant: 'light',
    error: '',
    label: '',
    placeholder: '',
    options: () => [],
  },
)

const model = defineModel<string>({ default: '' })
const attrs = useAttrs()
const generatedId = useId()
const rootRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(-1)

const fieldId = computed(() => {
  const id = attrs.id
  return typeof id === 'string' && id.length > 0 ? id : generatedId
})

const labelId = computed(() => `${fieldId.value}-label`)
const listId = computed(() => `${fieldId.value}-list`)
const errorId = computed(() => `${fieldId.value}-error`)

const fieldName = computed(() => {
  const name = attrs.name
  return typeof name === 'string' && name.length > 0 ? name : undefined
})

const triggerAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, name: _name, ...rest } = attrs
  return rest
})

const selectedIndex = computed(() =>
  props.options.findIndex((option) => option.value === model.value),
)

const triggerText = computed(() => {
  const index = selectedIndex.value
  return index >= 0 ? props.options[index]?.label : props.placeholder
})

const activeOptionId = computed(() => {
  if (!isOpen.value || activeIndex.value < 0) {
    return undefined
  }

  return optionId(activeIndex.value)
})

function optionId(index: number): string {
  return `${listId.value}-option-${index}`
}

function bindOutsideListener(bind: boolean): void {
  if (!import.meta.client) {
    return
  }

  if (bind) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
}

function close(): void {
  isOpen.value = false
  activeIndex.value = -1
  bindOutsideListener(false)
}

function open(): void {
  if (props.options.length === 0) {
    return
  }

  const index = selectedIndex.value
  activeIndex.value = index >= 0 ? index : 0
  isOpen.value = true
  bindOutsideListener(true)
  void ensureActiveVisible()
}

function toggle(): void {
  if (isOpen.value) {
    close()
    return
  }

  open()
}

function selectIndex(index: number): void {
  const option = props.options[index]
  if (!option) {
    return
  }

  model.value = option.value
  close()
}

async function ensureActiveVisible(): Promise<void> {
  await nextTick()
  const option = listRef.value?.children.item(activeIndex.value)
  if (option instanceof HTMLElement) {
    option.scrollIntoView({ block: 'nearest' })
  }
}

function moveActive(delta: number): void {
  const count = props.options.length
  if (count === 0) {
    return
  }

  const current = activeIndex.value < 0 ? (delta > 0 ? -1 : 0) : activeIndex.value
  activeIndex.value = (current + delta + count) % count
  void ensureActiveVisible()
}

function onTriggerKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (isOpen.value) {
        moveActive(1)
        break
      }
      open()
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        moveActive(-1)
        break
      }
      open()
      break
    case 'Home':
      if (isOpen.value && props.options.length > 0) {
        event.preventDefault()
        activeIndex.value = 0
        void ensureActiveVisible()
      }
      break
    case 'End':
      if (isOpen.value && props.options.length > 0) {
        event.preventDefault()
        activeIndex.value = props.options.length - 1
        void ensureActiveVisible()
      }
      break
    case 'Enter':
    case ' ':
      if (isOpen.value) {
        event.preventDefault()
        selectIndex(activeIndex.value)
      }
      break
    case 'Escape':
      if (isOpen.value) {
        event.preventDefault()
        close()
      }
      break
    case 'Tab':
      close()
      break
    default:
      break
  }
}

function onDocumentPointerDown(event: Event): void {
  const target = event.target
  if (!(target instanceof Node) || rootRef.value?.contains(target)) {
    return
  }

  close()
}

onBeforeUnmount(() => {
  bindOutsideListener(false)
})
</script>

<template>
  <div
    ref="rootRef"
    :class="[$style.root, attrs.class]"
    :style="attrs.style"
    :data-variant="variant"
  >
    <label
      v-if="label"
      :id="labelId"
      :class="$style.srOnly"
      :for="fieldId"
    >
      {{ label }}
    </label>
    <input
      v-if="fieldName"
      type="hidden"
      :name="fieldName"
      :value="model"
    >
    <button
      v-bind="triggerAttrs"
      :id="fieldId"
      :class="$style.trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? listId : undefined"
      :aria-activedescendant="activeOptionId"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error ? errorId : undefined"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span :class="$style.value">{{ triggerText }}</span>
      <UIcon name="local:arrow-down" :class="$style.icon" aria-hidden="true" />
    </button>
    <ul
      v-if="isOpen"
      :id="listId"
      ref="listRef"
      :class="$style.list"
      role="listbox"
      :aria-labelledby="label ? labelId : undefined"
      @mousedown.prevent
    >
      <li
        v-for="(option, index) in options"
        :id="optionId(index)"
        :key="option.value"
        :class="$style.option"
        role="option"
        :aria-selected="option.value === model"
        :data-active="index === activeIndex ? 'true' : undefined"
        @click="selectIndex(index)"
        @mouseenter="activeIndex = index"
      >
        {{ option.label }}
      </li>
    </ul>
    <p
      v-if="error"
      :id="errorId"
      :class="$style.error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  --fs-dropdown-bg: var(--fs-color-light);
  --fs-dropdown-pad-inline: #{rem(20)};
  --fs-dropdown-pad-block: #{rem(12)};
  --fs-dropdown-icon: #{rem(20)};
  --fs-dropdown-list-max: #{rem(240)};

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  width: 100%;

  &[data-variant='white'] {
    --fs-dropdown-bg: var(--fs-color-white);
  }

  @include from-desktop {
    --fs-dropdown-pad-inline: var(--fs-space-3);
    --fs-dropdown-pad-block: var(--fs-space-2);
    --fs-dropdown-icon: #{rem(24)};
    --fs-dropdown-list-max: #{rem(264)};
  }
}

.trigger {
  display: flex;
  gap: var(--fs-space-1);
  align-items: center;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: var(--fs-dropdown-pad-block) var(--fs-dropdown-pad-inline);
  border: 0;
  border-radius: rem(100);
  @include fs-text-lg;
  color: var(--fs-color-black);
  text-align: start;
  background-color: var(--fs-dropdown-bg);
  cursor: pointer;
  appearance: none;
  transition: background-color 0.2s ease;

  &:focus-visible:not(:disabled) {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  &:disabled {
    color: var(--fs-color-gray);
    cursor: not-allowed;
  }

  &[aria-expanded='true'] .icon {
    transform: rotate(180deg);
  }

  @media (hover: hover) {
    &:not(:disabled):not([aria-expanded='true']):hover {
      background-color: var(--fs-color-light-hover);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    .icon {
      transition: none;
    }
  }
}

.value {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon {
  flex-shrink: 0;
  width: var(--fs-dropdown-icon);
  height: var(--fs-dropdown-icon);
  overflow: clip;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.list {
  --scrollbar-thumb: var(--fs-color-beige);
  --scrollbar-track: transparent;

  position: absolute;
  top: calc(100% + var(--fs-space-1));
  left: 0;
  z-index: z('dropdown');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  max-height: var(--fs-dropdown-list-max);
  margin: 0;
  padding: var(--fs-dropdown-pad-inline);
  overflow: hidden auto;
  border-radius: var(--fs-radius-xl);
  list-style: none;
  background-color: var(--fs-dropdown-bg);
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);

  @media (prefers-contrast: more) {
    --scrollbar-thumb: var(--fs-color-black);
  }

  @supports not (scrollbar-color: auto) {
    &::-webkit-scrollbar {
      width: rem(4);
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: rem(100);
      background-color: var(--scrollbar-thumb);
    }

    &::-webkit-scrollbar-track {
      background-color: var(--scrollbar-track);
    }
  }
}

.option {
  min-width: 0;
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
  overflow-wrap: break-word;
  cursor: pointer;

  &[data-active='true'] {
    color: var(--fs-color-black);
  }
}

.error {
  margin: 0;
  padding-inline: var(--fs-dropdown-pad-inline);
  @include fs-text-sm;
  color: var(--fs-color-error);
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
