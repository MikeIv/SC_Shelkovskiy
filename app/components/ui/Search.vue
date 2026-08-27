<script setup lang="ts">
export type UiSearchVariant = 'light' | 'white'

export interface UiSearchOption {
  value: string
  label: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: UiSearchVariant
    error?: string
    label?: string
    placeholder?: string
    options?: UiSearchOption[]
  }>(),
  {
    variant: 'light',
    error: '',
    label: '',
    placeholder: 'Найти магазин',
    options: () => [],
  },
)

const emit = defineEmits<{
  select: [option: UiSearchOption]
}>()

const model = defineModel<string>({ default: '' })
const attrs = useAttrs()
const generatedId = useId()
const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
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

const inputAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, type: _type, ...rest } = attrs
  return rest
})

const isDisabled = computed(() => {
  const value = attrs.disabled
  return value === true || value === '' || value === 'disabled'
})

const suggestions = computed(() => {
  const query = model.value.trim().toLowerCase()
  if (!query) {
    return []
  }

  return props.options.filter((option) =>
    option.label.toLowerCase().includes(query),
  )
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

function openList(resetActive = false): void {
  if (suggestions.value.length === 0) {
    close()
    return
  }

  if (
    resetActive ||
    activeIndex.value < 0 ||
    activeIndex.value >= suggestions.value.length
  ) {
    activeIndex.value = 0
  }

  isOpen.value = true
  bindOutsideListener(true)
  void ensureActiveVisible()
}

function selectIndex(index: number): void {
  const option = suggestions.value[index]
  if (!option) {
    return
  }

  model.value = option.label
  emit('select', option)
  close()
}

function clear(): void {
  model.value = ''
  close()
  inputRef.value?.focus()
}

async function ensureActiveVisible(): Promise<void> {
  await nextTick()
  const option = listRef.value?.children.item(activeIndex.value)
  if (option instanceof HTMLElement) {
    option.scrollIntoView({ block: 'nearest' })
  }
}

function moveActive(delta: number): void {
  const count = suggestions.value.length
  if (count === 0) {
    return
  }

  const current = activeIndex.value < 0 ? (delta > 0 ? -1 : 0) : activeIndex.value
  activeIndex.value = (current + delta + count) % count
  void ensureActiveVisible()
}

function onInputKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (isOpen.value) {
        moveActive(1)
        break
      }
      openList()
      break
    case 'ArrowUp':
      event.preventDefault()
      if (isOpen.value) {
        moveActive(-1)
        break
      }
      openList()
      break
    case 'Home':
      if (isOpen.value && suggestions.value.length > 0) {
        event.preventDefault()
        activeIndex.value = 0
        void ensureActiveVisible()
      }
      break
    case 'End':
      if (isOpen.value && suggestions.value.length > 0) {
        event.preventDefault()
        activeIndex.value = suggestions.value.length - 1
        void ensureActiveVisible()
      }
      break
    case 'Enter':
      if (isOpen.value && activeIndex.value >= 0) {
        event.preventDefault()
        selectIndex(activeIndex.value)
      } else {
        close()
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
    <div :class="$style.shell">
      <UIcon name="local:search" :class="$style.icon" aria-hidden="true" />
      <input
        v-bind="inputAttrs"
        :id="fieldId"
        ref="inputRef"
        v-model="model"
        :class="$style.field"
        type="search"
        enterkeyhint="search"
        :placeholder="placeholder"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        :aria-expanded="isOpen"
        :aria-controls="isOpen ? listId : undefined"
        :aria-activedescendant="activeOptionId"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? errorId : undefined"
        :aria-label="label ? undefined : placeholder"
        autocomplete="off"
        spellcheck="false"
        @input="openList(true)"
        @focus="openList()"
        @keydown="onInputKeydown"
      >
      <button
        v-if="model && !isDisabled"
        :class="$style.clear"
        type="button"
        aria-label="Очистить"
        @mousedown.prevent
        @click="clear"
      >
        <UIcon name="local:cross" :class="$style.icon" aria-hidden="true" />
      </button>
    </div>
    <ul
      v-if="isOpen"
      :id="listId"
      ref="listRef"
      :class="$style.list"
      role="listbox"
      :aria-labelledby="label ? labelId : undefined"
      :aria-label="label ? undefined : placeholder"
      @mousedown.prevent
    >
      <li
        v-for="(option, index) in suggestions"
        :id="optionId(index)"
        :key="option.value"
        :class="$style.option"
        role="option"
        :aria-selected="index === activeIndex"
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
  --fs-search-bg: var(--fs-color-light);
  --fs-search-pad-inline: #{rem(20)};
  --fs-search-pad-block: #{rem(12)};
  --fs-search-icon: #{rem(20)};
  --fs-search-list-max: #{rem(240)};

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  width: 100%;

  &[data-variant='white'] {
    --fs-search-bg: var(--fs-color-white);
  }

  @include from-desktop {
    --fs-search-pad-inline: var(--fs-space-3);
    --fs-search-pad-block: var(--fs-space-2);
    --fs-search-icon: #{rem(24)};
    --fs-search-list-max: #{rem(264)};
  }
}

.shell {
  display: flex;
  gap: var(--fs-space-1);
  align-items: center;
  width: 100%;
  min-width: 0;
  padding: var(--fs-search-pad-block) var(--fs-search-pad-inline);
  border-radius: rem(100);
  color: var(--fs-color-black);
  background-color: var(--fs-search-bg);
  transition: background-color 0.2s ease;

  &:has(.field:focus-visible) {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  &:has(:disabled) {
    color: var(--fs-color-gray);
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:hover:not(:focus-within):not(:has(:disabled)) {
      background-color: var(--fs-color-light-hover);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.field {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-lg;
  color: var(--fs-color-black);
  background-color: transparent;
  outline: none;
  appearance: none;

  &::placeholder {
    color: var(--fs-color-black);
    opacity: 1;
  }

  &:disabled {
    color: var(--fs-color-gray);
    cursor: not-allowed;

    &::placeholder {
      color: var(--fs-color-gray);
    }
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button {
    appearance: none;
  }
}

.icon {
  flex-shrink: 0;
  width: var(--fs-search-icon);
  height: var(--fs-search-icon);
  overflow: clip;
  pointer-events: none;
}

.clear {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--fs-search-icon);
  height: var(--fs-search-icon);
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
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
  max-height: var(--fs-search-list-max);
  margin: 0;
  padding: var(--fs-search-pad-inline);
  overflow: hidden auto;
  border-radius: var(--fs-radius-xl);
  list-style: none;
  background-color: var(--fs-search-bg);
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
  padding-inline: var(--fs-search-pad-inline);
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
