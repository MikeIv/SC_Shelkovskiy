<script setup lang="ts">
export type UiTextareaVariant = 'light' | 'white'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    variant?: UiTextareaVariant
    error?: string
    label?: string
  }>(),
  {
    variant: 'light',
    error: '',
    label: '',
  },
)

const model = defineModel<string>({ default: '' })
const attrs = useAttrs()
const generatedId = useId()

const inputId = computed(() => {
  const id = attrs.id
  return typeof id === 'string' && id.length > 0 ? id : generatedId
})

const inputAttrs = computed(() => {
  const { class: _class, style: _style, id: _id, ...rest } = attrs
  return rest
})
</script>

<template>
  <div
    :class="[$style.root, attrs.class]"
    :style="attrs.style"
    :data-variant="variant"
  >
    <label v-if="label" :class="$style.srOnly" :for="inputId">
      {{ label }}
    </label>
    <div :class="$style.shell">
      <textarea
        v-bind="inputAttrs"
        :id="inputId"
        v-model="model"
        :class="$style.field"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? `${inputId}-error` : undefined"
      />
    </div>
    <p
      v-if="error"
      :id="`${inputId}-error`"
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
  --fs-textarea-bg: var(--fs-color-light);
  --fs-textarea-pad: #{rem(20)};
  --fs-textarea-radius: #{rem(24)};

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  width: 100%;

  &[data-variant='white'] {
    --fs-textarea-bg: var(--fs-color-white);
  }

  @include from-desktop {
    --fs-textarea-pad: var(--fs-space-3);
    --fs-textarea-radius: #{rem(32)};
  }
}

.shell {
  overflow: hidden;
  height: rem(120);
  padding: var(--fs-textarea-pad);
  border-radius: var(--fs-textarea-radius);
  background-color: var(--fs-textarea-bg);
  transition: background-color 0.2s ease;

  &:focus-within {
    background-color: var(--fs-color-light);
  }

  &:has(:focus-visible) {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  &:has(:disabled) {
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
  --scrollbar-thumb: var(--fs-color-beige);
  --scrollbar-track: transparent;

  display: block;
  width: 100%;
  min-width: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-lg;
  color: var(--fs-color-black);
  overflow-wrap: break-word;
  background-color: transparent;
  overflow: hidden auto;
  outline: none;
  resize: none;
  appearance: none;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);

  &::placeholder {
    color: var(--fs-color-gray);
    opacity: 1;
  }

  &:disabled {
    color: var(--fs-color-gray);
    cursor: not-allowed;
  }

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

.error {
  margin: 0;
  padding-inline: var(--fs-textarea-pad);
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
