<script setup lang="ts">
import { apiErrorStatus } from '#shared/api/errors'
import { firstFieldError, readFormError } from '#shared/api/formErrors'
import type { ContactsFeedbackContent } from '#shared/types/contacts'
import type { FeedbackFormPayload } from '#shared/types/forms'
import { isFeedbackTopic } from '#shared/types/forms'
import { isEmail } from '#shared/utils/isEmail'
import { useSubmitFeedback } from '~/composables/api/useSubmitFeedback'
import { footerContacts } from '~/utils/siteFooter'

const props = defineProps<{
  open: boolean
  content: ContactsFeedbackContent
}>()

const emit = defineEmits<{
  close: []
}>()

const requiredError = 'Обязательное поле'
const emailFormatError = 'Некорректный email'

const titleId = useId()
const closeRef = ref<HTMLButtonElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const toast = useUiToast()
const { submit } = useSubmitFeedback()

const form = reactive({
  topic: '',
  fullName: '',
  phone: '',
  email: '',
  message: '',
})
const errors = reactive({
  topic: '',
  fullName: '',
  phone: '',
  email: '',
  message: '',
})
const consentPersonal = ref(false)
const consentPolicies = ref(false)
const consentMailing = ref(false)
const consentError = ref('')
const fileName = ref('')
const websiteUrl = ref('')
const submitting = ref(false)
/** Номер отправки: результат запроса, пережившего сброс формы, в неё не пишем. */
let submitSeq = 0

let previousOverflow = ''
let previousFocus: HTMLElement | null = null

const requiredConsentsOk = computed(
  () => consentPersonal.value && consentPolicies.value,
)

for (const field of ['topic', 'fullName', 'phone', 'email', 'message'] as const) {
  watch(
    () => form[field],
    () => {
      errors[field] = ''
    },
  )
}

watch([consentPersonal, consentPolicies], () => {
  consentError.value = ''
})

function close(): void {
  emit('close')
}

function clearFile(): void {
  fileName.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function clearErrors(): void {
  for (const key of Object.keys(errors) as (keyof typeof errors)[]) {
    errors[key] = ''
  }
  consentError.value = ''
}

function resetForm(): void {
  form.topic = ''
  form.fullName = ''
  form.phone = ''
  form.email = ''
  form.message = ''
  consentPersonal.value = false
  consentPolicies.value = false
  consentMailing.value = false
  websiteUrl.value = ''
  clearErrors()
  clearFile()
  submitSeq += 1
  submitting.value = false
}

function openFilePicker(): void {
  fileInput.value?.click()
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  fileName.value = input.files?.[0]?.name ?? ''
}

/** Проверяет поля и собирает тело запроса; `null` — форма не готова к отправке. */
function validate(): FeedbackFormPayload | null {
  const topic = form.topic

  errors.topic = isFeedbackTopic(topic) ? '' : requiredError
  errors.fullName = form.fullName.trim() ? '' : requiredError
  errors.phone = form.phone.trim() ? '' : requiredError
  errors.email = !form.email.trim()
    ? requiredError
    : isEmail(form.email)
      ? ''
      : emailFormatError
  errors.message = form.message.trim() ? '' : requiredError
  consentError.value = requiredConsentsOk.value ? '' : requiredError

  const valid = Object.values(errors).every((value) => !value) && !consentError.value

  if (!valid || !isFeedbackTopic(topic)) return null

  const website = websiteUrl.value.trim()

  return {
    /** Контракт `/forms/feedback` знает одно согласие: сюда сворачиваются оба обязательных. */
    consent: requiredConsentsOk.value,
    topic,
    name: form.fullName.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    message: form.message.trim(),
    /**
     * Хонейпот уходит только заполненным: пустое поле не шлём, чтобы не спорить
     * с правилами Laravel вроде `prohibited`, а заполненное — сигнал для API.
     */
    ...(website ? { website_url: website } : {}),
  }
}

function applyApiFieldErrors(payload: ReturnType<typeof readFormError>): void {
  errors.topic = firstFieldError(payload, 'topic') ?? errors.topic
  errors.fullName = firstFieldError(payload, 'name') ?? errors.fullName
  errors.phone = firstFieldError(payload, 'phone') ?? errors.phone
  errors.email = firstFieldError(payload, 'email') ?? errors.email
  errors.message = firstFieldError(payload, 'message') ?? errors.message
  consentError.value = firstFieldError(payload, 'consent') ?? consentError.value
}

async function onSubmit(): Promise<void> {
  if (submitting.value) return

  const payload = validate()

  if (!payload) return

  const seq = ++submitSeq
  submitting.value = true

  try {
    await submit(payload)

    toast.success({
      title: 'Заявка отправлена',
      description: 'Мы свяжемся с вами в ближайшее время',
    })

    if (submitSeq === seq) close()
  } catch (error: unknown) {
    const status = apiErrorStatus(error)
    const apiError = readFormError(error)
    /** Форму закрыли или сбросили, пока запрос шёл: ошибки полей уже некуда писать. */
    const stale = submitSeq !== seq

    if (status === 422) {
      if (!stale) applyApiFieldErrors(apiError)

      toast.error({ title: apiError?.message ?? 'Проверьте поля формы' })
      return
    }

    if (status === 429) {
      toast.error({
        title: 'Слишком много заявок',
        description: 'Попробуйте отправить форму позже',
      })
      return
    }

    toast.error({
      title: 'Не удалось отправить',
      description: 'Попробуйте ещё раз',
    })
  } finally {
    if (submitSeq === seq) submitting.value = false
  }
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
            <!-- Хонейпот: `inert` убирает поле из фокуса и из дерева доступности, бот его заполнит. -->
            <input
              v-model="websiteUrl"
              :class="$style.hiddenInput"
              type="text"
              name="website_url"
              tabindex="-1"
              autocomplete="off"
              inert
            >
            <UiDropdown
              v-model="form.topic"
              name="topic"
              placeholder="Тема обращения"
              label="Тема обращения"
              :options="content.topics"
              :error="errors.topic"
              :disabled="submitting"
            />
            <UiInput
              v-model="form.fullName"
              name="fullName"
              autocomplete="name"
              placeholder="ФИО"
              label="ФИО"
              :error="errors.fullName"
              :disabled="submitting"
            />
            <div :class="$style.row">
              <UiInput
                v-model="form.phone"
                type="tel"
                name="phone"
                autocomplete="tel"
                placeholder="Телефон"
                label="Телефон"
                :error="errors.phone"
                :disabled="submitting"
              />
              <UiInput
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="Почта"
                label="Почта"
                :error="errors.email"
                :disabled="submitting"
              />
            </div>
            <UiTextarea
              v-model="form.message"
              name="message"
              placeholder="Ваше сообщение"
              label="Ваше сообщение"
              :error="errors.message"
              :disabled="submitting"
            />
            <div :class="$style.attach">
              <!--
                Вложение пока не уходит: файл уедет отдельной ручкой, когда бэкенд
                дополнит `POST /forms/feedback`. До этого выбор файла на отправку не влияет.
              -->
              <input
                ref="fileInput"
                :class="$style.hiddenInput"
                type="file"
                name="attachment"
                :disabled="submitting"
                @change="onFileChange"
              >
              <button
                :class="$style.attachBtn"
                type="button"
                :disabled="submitting"
                @click="openFilePicker"
              >
                <UIcon
                  name="local:paper-clip"
                  :class="$style.attachIcon"
                  aria-hidden="true"
                />
                <span :class="$style.attachLabel">{{ fileName || 'Прикрепить файл' }}</span>
              </button>
              <button
                v-if="fileName"
                :class="$style.attachClear"
                type="button"
                aria-label="Удалить файл"
                :disabled="submitting"
                @click="clearFile"
              >
                <UIcon
                  name="local:cross"
                  :class="$style.attachClearIcon"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <div :class="$style.footer">
            <UiFormConsents
              v-model:personal="consentPersonal"
              v-model:policies="consentPolicies"
              v-model:mailing="consentMailing"
              :privacy-href="footerContacts.privacyHref"
              :disabled="submitting"
              :error="consentError"
            />

            <UiButton
              :class="$style.submit"
              type="submit"
              :disabled="submitting"
            >
              {{ submitting ? 'Отправка…' : 'Отправить' }}
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
  min-width: 0;
  margin-block: auto;
}

.header,
.form {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  padding: var(--fs-space-4);
  border-radius: rem(32);
  background-color: var(--fs-color-white);

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
  max-width: none;
  height: rem(999);
  pointer-events: none;
}

.headerFade {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: rem(214);
  background-image: linear-gradient(
    to top,
    var(--fs-color-white) 0%,
    rgb(255 255 255 / 0%) 35.5%
  );
  pointer-events: none;
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
    border-radius: rem(2);
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
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
  min-width: 0;
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
  gap: rem(12);
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

/** Визуально скрытый input: нативный файл под кнопкой и хонейпот. */
.hiddenInput {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  white-space: nowrap;
  overflow: hidden;
  clip-path: inset(50%);
}

.attachBtn {
  display: inline-flex;
  gap: rem(12);
  align-items: center;
  min-width: 0;
  max-width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--fs-color-black);
  text-align: start;
  background: transparent;
  overflow: hidden;
  cursor: pointer;
  appearance: none;
  @include fs-text-md;

  &:focus-visible {
    border-radius: rem(4);
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(4);
  }
}

.attachLabel {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attachIcon,
.attachClearIcon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}

.attachClear {
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
  background-color: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    border-radius: rem(2);
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.footer {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.submit {
  width: 100%;
}
</style>
