<script setup lang="ts">
import type { ContactsFeedbackContent } from '#shared/types/contacts'
import { footerContacts } from '~/utils/siteFooter'

const props = defineProps<{
  open: boolean
  content: ContactsFeedbackContent
}>()

const emit = defineEmits<{
  close: []
}>()

const titleId = useId()
const closeRef = ref<HTMLButtonElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  topic: '',
  fullName: '',
  phone: '',
  email: '',
  message: '',
})
const consent = ref(false)
const fileName = ref('')

let previousOverflow = ''
let previousFocus: HTMLElement | null = null

function close(): void {
  emit('close')
}

function resetForm(): void {
  form.topic = ''
  form.fullName = ''
  form.phone = ''
  form.email = ''
  form.message = ''
  consent.value = false
  fileName.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function openFilePicker(): void {
  fileInput.value?.click()
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  fileName.value = input.files?.[0]?.name ?? ''
}

function onSubmit(): void {
  // Отправка появится после контракта API.
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function lockScroll(lock: boolean): void {
  if (!import.meta.client) {
    return
  }

  if (lock) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousOverflow
}

function bindKeydown(bind: boolean): void {
  if (!import.meta.client) {
    return
  }

  document.removeEventListener('keydown', onKeydown)

  if (bind) {
    document.addEventListener('keydown', onKeydown)
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!import.meta.client) {
      return
    }

    bindKeydown(isOpen)
    lockScroll(isOpen)

    if (!isOpen) {
      resetForm()
      previousFocus?.focus()
      previousFocus = null
      return
    }

    previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    await nextTick()
    closeRef.value?.focus()
  },
)

onBeforeUnmount(() => {
  bindKeydown(false)
  lockScroll(false)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      :class="$style.root"
    >
      <div
        :class="$style.backdrop"
        aria-hidden="true"
        @click="close"
      />

      <div
        :class="$style.dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div :class="$style.header">
          <img
            :class="$style.pattern"
            :src="content.patternSrc"
            alt=""
            width="1001"
            height="999"
            aria-hidden="true"
            decoding="async"
          >
          <div :class="$style.headerFade" aria-hidden="true" />

          <div :class="$style.headerBody">
            <h2 :id="titleId" :class="$style.title">
              {{ content.title }}
            </h2>
            <p :class="$style.description">
              {{ content.description }}
            </p>
          </div>

          <button
            ref="closeRef"
            :class="$style.close"
            type="button"
            aria-label="Закрыть"
            @click="close"
          >
            <UIcon name="local:cross" :class="$style.closeIcon" aria-hidden="true" />
          </button>
        </div>

        <form :class="$style.form" @submit.prevent="onSubmit">
          <div :class="$style.fields">
            <UiDropdown
              v-model="form.topic"
              name="topic"
              placeholder="Тема обращения"
              label="Тема обращения"
              :options="content.topics"
            />
            <UiInput
              v-model="form.fullName"
              name="fullName"
              autocomplete="name"
              placeholder="ФИО"
              label="ФИО"
            />
            <div :class="$style.row">
              <UiInput
                v-model="form.phone"
                type="tel"
                name="phone"
                autocomplete="tel"
                placeholder="Телефон"
                label="Телефон"
              />
              <UiInput
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="Почта"
                label="Почта"
              />
            </div>
            <UiTextarea
              v-model="form.message"
              name="message"
              placeholder="Ваше сообщение"
              label="Ваше сообщение"
            />
            <div :class="$style.attach">
              <input
                ref="fileInput"
                :class="$style.fileInput"
                type="file"
                name="attachment"
                @change="onFileChange"
              >
              <button
                :class="$style.attachBtn"
                type="button"
                @click="openFilePicker"
              >
                <UIcon
                  name="local:paper-clip"
                  :class="$style.attachIcon"
                  aria-hidden="true"
                />
                <span>{{ fileName || 'Прикрепить файл' }}</span>
              </button>
            </div>
          </div>

          <div :class="$style.footer">
            <label :class="$style.consent">
              <UiCheckbox v-model="consent" />
              <span :class="$style.consentText">
                Даю согласие на
                <NuxtLink
                  v-if="footerContacts.privacyHref"
                  :class="$style.consentLink"
                  :to="footerContacts.privacyHref"
                  @click.stop
                >
                  обработку персональных данных
                </NuxtLink>
                <span
                  v-else
                  :class="$style.consentLink"
                >обработку персональных данных</span>
              </span>
            </label>

            <UiButton :class="$style.submit" type="submit">
              Отправить
            </UiButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: fixed;
  inset: 0;
  z-index: z('modal');
  display: grid;
  place-items: center;
  padding: var(--fs-space-3) var(--fs-grid-margin);
  overflow: auto;
  overscroll-behavior: contain;
}

.backdrop {
  position: fixed;
  inset: 0;
  background-color: color-mix(in srgb, var(--fs-color-black) 55%, transparent);
}

.dialog {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  width: min(100%, #{rem(643)});
  margin-block: auto;
}

.header,
.form {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--fs-space-4);
  background-color: var(--fs-color-white);
  border-radius: rem(32);

  @include from-desktop {
    padding: rem(56);
    border-radius: rem(60);
  }
}

.header {
  align-items: center;
  overflow: clip;
}

.headerBody {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: rem(8);
  align-items: center;
}

.pattern {
  position: absolute;
  top: rem(-528);
  left: rem(-179);
  width: rem(1001);
  height: rem(999);
  max-width: none;
  pointer-events: none;
}

.headerFade {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: rem(214);
  pointer-events: none;
  background-image: linear-gradient(
    to top,
    var(--fs-color-white) 0%,
    rgb(255 255 255 / 0%) 35.5%
  );
}

.title {
  @include fs-h2;
  margin: 0;
  text-align: center;
  overflow-wrap: break-word;
}

.description {
  max-width: rem(412);
  margin: 0;
  @include fs-text-lg;
  text-align: center;
  overflow-wrap: break-word;
}

.close {
  position: absolute;
  top: var(--fs-space-2);
  right: var(--fs-space-2);
  z-index: z('default');
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--fs-color-black);
  background-color: transparent;
  cursor: pointer;
  appearance: none;

  @include from-desktop {
    top: rem(32);
    right: rem(32);
    width: rem(24);
    height: rem(24);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
    border-radius: rem(2);
  }
}

.closeIcon {
  display: block;
  width: rem(24);
  height: rem(24);
}

.form {
  gap: var(--fs-space-5);
}

.fields {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--fs-space-2);

  @include from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.attach {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.fileInput {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.attachBtn {
  display: inline-flex;
  gap: rem(12);
  align-items: flex-start;
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  background: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(4);
    border-radius: rem(4);
  }
}

.attachIcon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}

.footer {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.consent {
  display: flex;
  gap: rem(12);
  align-items: flex-start;
  cursor: pointer;
}

.consentText {
  @include fs-text-lg;
}

.consentLink {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: rem(2);

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.submit {
  width: 100%;
}
</style>
