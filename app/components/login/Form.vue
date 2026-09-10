<script setup lang="ts">
import { loginPage } from '~/data/loginPage'

const emit = defineEmits<{
  forgot: []
}>()

const form = reactive({
  login: '',
  password: '',
})

function onSubmit(): void {
  // Отправка появится после контракта API.
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
