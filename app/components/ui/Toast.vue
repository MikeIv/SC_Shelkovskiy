<script setup lang="ts">
import { NuxtLink } from '#components'
import type { UiToastAction, UiToastVariant } from '~/composables/useUiToast'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    variant?: UiToastVariant
    action?: UiToastAction
  }>(),
  {
    description: undefined,
    variant: 'error',
    action: undefined,
  },
)

const emit = defineEmits<{
  close: []
}>()

const isExpanded = computed(
  () => Boolean(props.description || props.action),
)

const actionTag = computed(() => {
  if (!props.action) return null
  if (props.action.href) return 'a'
  if (props.action.to) return NuxtLink
  return 'button'
})

const actionBind = computed(() => {
  const action = props.action
  if (!action) return {}

  if (action.href) {
    return {
      href: action.href,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  if (action.to) return { to: action.to }

  return { type: 'button' as const }
})
</script>

<template>
  <div
    :class="$style.root"
    :data-variant="variant"
    :data-expanded="isExpanded ? '' : undefined"
    role="status"
    :aria-live="variant === 'error' ? 'assertive' : 'polite'"
  >
    <div :class="$style.body">
      <span
        :class="$style.status"
        aria-hidden="true"
      >
        <UIcon
          v-if="variant === 'success'"
          name="local:check"
          :class="$style.statusIcon"
        />
        <span
          v-else
          :class="$style.statusMark"
        >!</span>
      </span>

      <div :class="$style.content">
        <div :class="$style.copy">
          <p :class="$style.title">
            {{ title }}
          </p>
          <p
            v-if="description"
            :class="$style.description"
          >
            {{ description }}
          </p>
        </div>

        <component
          :is="actionTag"
          v-if="action && actionTag"
          :class="$style.action"
          v-bind="actionBind"
          @click="action.onClick?.()"
        >
          {{ action.label }}
        </component>
      </div>
    </div>

    <button
      :class="$style.close"
      type="button"
      aria-label="Закрыть"
      @click="emit('close')"
    >
      <UIcon
        name="local:cross"
        :class="$style.closeIcon"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  --fs-toast-icon: var(--fs-color-error);

  display: flex;
  gap: var(--fs-space-1);
  align-items: center;
  width: 100%;
  padding: var(--fs-space-2);
  overflow: clip;
  border-radius: var(--fs-radius-3xl);
  background-color: var(--fs-color-white);
  box-shadow: 0 #{rem(8)} #{rem(80)} rgb(172 172 172 / 25%);

  &[data-expanded] {
    align-items: flex-start;
    border-radius: var(--fs-radius-2xl);
  }

  &[data-variant='warning'] {
    /* Затемнение orange для читаемого белого «!» */
    --fs-toast-icon: color-mix(in srgb, var(--fs-color-orange) 72%, var(--fs-color-black));
  }

  &[data-variant='success'] {
    --fs-toast-icon: var(--fs-color-green);
  }

  @include from-desktop {
    width: rem(459);
  }
}

.body {
  display: flex;
  flex: 1 1 auto;
  gap: var(--fs-space-1);
  align-items: center;
  min-width: 0;

  .root[data-expanded] & {
    align-items: flex-start;
  }
}

.status {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: rem(20);
  height: rem(20);
  border-radius: 50%;
  color: var(--fs-color-white);
  background-color: var(--fs-toast-icon);

  @include from-desktop {
    width: rem(24);
    height: rem(24);
  }
}

.statusMark {
  font-family: var(--fs-font-sans);
  font-size: rem(13);
  font-weight: 700;
  line-height: 1;
}

.statusIcon {
  width: rem(12);
  height: rem(12);
  color: var(--fs-color-white);

  @include from-desktop {
    width: rem(14);
    height: rem(14);
  }
}

.content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: rem(12);
  align-items: flex-start;
  min-width: 0;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  align-items: flex-start;
  width: 100%;
  min-width: 0;
}

.title {
  margin: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  overflow-wrap: anywhere;
}

.description {
  margin: 0;
  @include fs-text;
  color: var(--fs-color-gray);
  overflow-wrap: anywhere;
}

.action {
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  text-decoration: none;
  background: none;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
}

.close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(24);
  height: rem(24);
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--fs-color-black);
  background: none;
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
</style>
