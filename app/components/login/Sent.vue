<script setup lang="ts">
import { loginRecoverTitle, loginSent } from '~/data/loginPage'

defineProps<{
  email: string
}>()

const emit = defineEmits<{
  resend: []
  login: []
}>()
</script>

<template>
  <LoginCard
    :title="loginRecoverTitle.title"
    :title-lead="loginRecoverTitle.titleLead"
    title-id="login-sent-title"
    aria-labelledby="login-sent-title"
  >
    <template #description>
      {{ loginSent.description }}
      <span :class="$style.email">{{ email }}</span>
    </template>

    <template #actions>
      <LoginTextButton @click="emit('resend')">
        {{ loginSent.resendLabel }}
      </LoginTextButton>
      <UiButton type="button" @click="emit('login')">
        {{ loginSent.submitLabel }}
      </UiButton>
    </template>
  </LoginCard>
</template>

<style module lang="scss">
@use 'tools' as *;

.email {
  display: block;
  @include fs-text-md;
}
</style>
