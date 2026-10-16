<script setup lang="ts">
import { NuxtLink } from '#components'

const {
  privacyHref = '',
  disabled = false,
  error = '',
} = defineProps<{
  privacyHref?: string
  disabled?: boolean
  error?: string
}>()

const personal = defineModel<boolean>('personal', { default: false })
const policies = defineModel<boolean>('policies', { default: false })
const mailing = defineModel<boolean>('mailing', { default: false })

function linkBind(href: string | undefined) {
  return href ? { to: href } : {}
}
</script>

<template>
  <div :class="$style.root">
    <label :class="$style.consent">
      <UiCheckbox v-model="personal" :disabled="disabled" />
      <span :class="$style.text">
        Я даю согласие на
        <component
          :is="privacyHref ? NuxtLink : 'span'"
          :class="$style.link"
          v-bind="linkBind(privacyHref)"
          @click.stop
        >
          обработку персональных данных
        </component>
      </span>
    </label>

    <label :class="$style.consent">
      <UiCheckbox v-model="policies" :disabled="disabled" />
      <span :class="$style.text">
        Я ознакомлен с
        <component
          :is="privacyHref ? NuxtLink : 'span'"
          :class="$style.link"
          v-bind="linkBind(privacyHref)"
          @click.stop
        >
          политикой обработки персональных данных
        </component>
        и
        <component
          :is="privacyHref ? NuxtLink : 'span'"
          :class="$style.link"
          v-bind="linkBind(privacyHref)"
          @click.stop
        >
          политикой конфиденциальности
        </component>
      </span>
    </label>

    <label :class="$style.consent">
      <UiCheckbox v-model="mailing" :disabled="disabled" />
      <span :class="$style.text">
        Разрешаю рассылку по электронной почте/SMS от ООО «Щелковская площадь»
      </span>
    </label>

    <p
      v-if="error"
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
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: flex-start;
  width: 100%;
}

.consent {
  display: flex;
  gap: rem(12);
  align-items: flex-start;
  width: 100%;
  cursor: pointer;
}

.text {
  @include fs-text-lg;
}

.link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: rem(2);

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.error {
  margin: 0;
  @include fs-text-md;
  color: var(--fs-color-error);
}
</style>
