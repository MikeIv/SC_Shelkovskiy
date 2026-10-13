<script setup lang="ts">
import { isEmail } from '#shared/utils/isEmail'
import { loginForgot } from '~/data/loginPage'

const emit = defineEmits<{
  cancel: []
  restore: [email: string]
}>()

const email = ref('')
const error = ref('')

const canSubmit = computed(() => isEmail(email.value))

watch(email, () => {
  error.value = ''
})

function onSubmit(): void {
  const value = email.value.trim()

  if (!value) {
    error.value = 'Обязательное поле'
    return
  }

  if (!isEmail(value)) {
    error.value = 'Некорректный email'
    return
  }

  emit('restore', value)
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
        :error="error"
        required
      />
    </template>

    <template #actions>
      <UiButton type="submit" :disabled="!canSubmit">
        {{ loginForgot.submitLabel }}
      </UiButton>
      <LoginTextButton @click="emit('cancel')">
        {{ loginForgot.cancelLabel }}
      </LoginTextButton>
    </template>
  </LoginCard>
</template>
