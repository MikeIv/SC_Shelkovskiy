<script setup lang="ts">
import { loginPage } from '~/data/loginPage'

const emit = defineEmits<{
  forgot: []
}>()

const form = reactive({
  login: '',
  password: '',
})

const errors = reactive({
  login: '',
  password: '',
})

for (const field of ['login', 'password'] as const) {
  watch(
    () => form[field],
    () => {
      errors[field] = ''
    },
  )
}

function onSubmit(): void {
  // Ошибки по макету до контракта API: любой submit показывает оба сообщения.
  Object.assign(errors, loginPage.fieldErrors)
}
</script>

<template>
  <LoginCard
    as="form"
    :title="loginPage.title"
    :title-lead="loginPage.titleLead"
    :description="loginPage.description"
    title-id="login-title"
    aria-labelledby="login-title"
    @submit.prevent="onSubmit"
  >
    <template #fields>
      <UiInput
        v-model="form.login"
        variant="white"
        name="login"
        autocomplete="username"
        :placeholder="loginPage.loginPlaceholder"
        :label="loginPage.loginPlaceholder"
        :error="errors.login"
        required
      />
      <UiInput
        v-model="form.password"
        variant="white"
        type="password"
        name="password"
        autocomplete="current-password"
        :placeholder="loginPage.passwordPlaceholder"
        :label="loginPage.passwordPlaceholder"
        :error="errors.password"
        required
      />
    </template>

    <template #actions>
      <LoginTextButton @click="emit('forgot')">
        {{ loginPage.forgotLabel }}
      </LoginTextButton>
      <UiButton type="submit">
        {{ loginPage.submitLabel }}
      </UiButton>
    </template>
  </LoginCard>
</template>
