<script setup lang="ts">
export type UiInputVariant = 'light' | 'white'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    variant?: UiInputVariant
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
    <input
      v-bind="inputAttrs"
      :id="inputId"
      v-model="model"
      :class="$style.field"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="error ? `${inputId}-error` : undefined"
    >
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
  --fs-input-bg: var(--fs-color-light);
  --fs-input-pad-inline: #{rem(20)};

  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  width: 100%;

  &[data-variant='white'] {
    --fs-input-bg: var(--fs-color-white);
  }

  @include from-desktop {
    --fs-input-pad-inline: var(--fs-space-3);
  }
}

.field {
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: rem(12) var(--fs-input-pad-inline);
  border: 0;
  border-radius: rem(100);
  @include fs-text-lg;
  color: var(--fs-color-black);
  background-color: var(--fs-input-bg);
  appearance: none;
  transition: background-color 0.2s ease;

  @include from-desktop {
    padding-block: var(--fs-space-2);
  }

  &::placeholder {
    color: var(--fs-color-gray);
    opacity: 1;
  }

  &:focus-visible:not(:disabled) {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  &:disabled {
    color: var(--fs-color-gray);
    cursor: not-allowed;
  }

  @media (hover: hover) {
    &:not(:disabled):not(:focus):hover {
      background-color: var(--fs-color-light-hover);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.error {
  margin: 0;
  padding-inline: var(--fs-input-pad-inline);
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
