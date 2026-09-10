<script setup lang="ts">
import { loginForgot } from '~/data/loginPage'

const emit = defineEmits<{
  cancel: []
  restore: [email: string]
}>()

const email = ref('')

function onSubmit(): void {
  emit('restore', email.value)
}
</script>

<template>
  <LoginCard
    as="form"
    :title="loginForgot.title"
    :title-lead="loginForgot.titleLead"
    :description="loginForgot.description"
    title-id="login-forgot-title"
    aria-labelledby="login-forgot-title"
    @submit.prevent="onSubmit"
  >
    <template #fields>
      <UiInput
        v-model="email"
        variant="white"
        type="email"
        name="email"
        autocomplete="email"
        :placeholder="loginForgot.emailPlaceholder"
        :label="loginForgot.emailPlaceholder"
        required
      />
    </template>

    <template #actions>
      <UiButton type="submit">
        {{ loginForgot.submitLabel }}
      </UiButton>
      <LoginTextButton @click="emit('cancel')">
        {{ loginForgot.cancelLabel }}
      </LoginTextButton>
    </template>
  </LoginCard>
</template>
