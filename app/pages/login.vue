<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

type LoginView = 'login' | 'forgot' | 'sent'

const view = ref<LoginView>('login')
const sentEmail = ref('')

const pageTitle = computed(() =>
  view.value === 'login' ? 'Вход в личный кабинет' : 'Восстановление пароля',
)

useSeoMeta({
  title: pageTitle,
})

function showLogin(): void {
  view.value = 'login'
}

function showForgot(): void {
  view.value = 'forgot'
}

function onRestore(email: string): void {
  sentEmail.value = email
  view.value = 'sent'
}

function onResend(): void {
  // Повторная отправка появится после контракта API.
}
</script>

<template>
  <div :class="$style.root">
    <div
      :class="$style.watermark"
      aria-hidden="true"
    />

    <LoginForm v-if="view === 'login'" @forgot="showForgot" />
    <LoginForgot
      v-else-if="view === 'forgot'"
      @cancel="showLogin"
      @restore="onRestore"
    />
    <LoginSent
      v-else
      :email="sentEmail"
      @resend="onResend"
      @login="showLogin"
    />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  overflow: clip;
  padding-block: var(--fs-space-4);
  padding-inline: var(--fs-grid-margin);

  @include from-desktop {
    padding-block: rem(72) rem(96);
  }
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(100%, rem(600));
  height: min(100%, rem(600));
  pointer-events: none;
  background-color: var(--fs-color-ornament);
  mask: url('/images/ornament/pattern.svg') center / contain no-repeat;
  transform: translate(-50%, -50%);

  @include from-tablet {
    width: rem(900);
    height: rem(900);
  }

  @include from-desktop {
    width: rem(1348);
    height: rem(1344);
  }
}
</style>
