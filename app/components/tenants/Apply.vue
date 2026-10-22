<script setup lang="ts">
import type { TenantsFormTab, TenantsTradeProfile } from '#shared/types/tenants'
import {
  isFullName,
  isHttpUrl,
  isNonNegativeInt,
  isNonNegativeIntChars,
  isPersonNameChars,
  isPhone,
  isPhoneChars,
  isPositiveAmount,
  isPositiveAmountChars,
  maskPersonName,
  maskPhone,
  parsePositiveAmount,
} from '#shared/utils/formFields'
import { isEmail } from '#shared/utils/isEmail'

const {
  title,
  privacyHref,
  presentationLabel,
  presentationHref,
  presentationNote,
  contactsTitle,
  contactsDecorSrc,
  phoneLabel,
  phoneDisplay,
  phoneExt,
  phoneHref,
  emailLabel,
  email,
  emailHref,
  tradeProfiles,
} = defineProps<{
  title: string
  privacyHref: string
  presentationLabel: string
  presentationHref: string
  presentationNote: string
  contactsTitle: string
  contactsDecorSrc: string
  phoneLabel: string
  phoneDisplay: string
  phoneExt: string
  phoneHref: string
  emailLabel: string
  email: string
  emailHref: string
  tradeProfiles: TenantsTradeProfile[]
}>()

const requiredError = 'Обязательное поле'
const emailFormatError = 'Некорректный email'
const lettersError = 'Допустимы только буквы'
const fullNameFormatError = 'Введите корректные данные'
const phoneFormatError = 'Некорректный телефон'
const urlFormatError = 'Некорректный адрес сайта'
const digitsError = 'Допустимы только цифры'
const intFormatError = 'Укажите целое число'
const amountFormatError = 'Некорректное число'
const areaRangeError = '«От» не может быть больше «До»'

const activeTab = ref<TenantsFormTab>('lease')
const form = reactive({
  fullName: '',
  position: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  company: '',
  storesCount: '',
  productProfile: '',
  brands: '',
  malls: '',
  areaFrom: '',
  areaTo: '',
  areaOptimal: '',
  adsMessage: '',
})
const errors = reactive({
  fullName: '',
  phone: '',
  email: '',
  website: '',
  storesCount: '',
  areaFrom: '',
  areaTo: '',
  areaOptimal: '',
  adsMessage: '',
})
const touched = reactive({
  fullName: false,
  phone: false,
  email: false,
  website: false,
  storesCount: false,
  areaFrom: false,
  areaTo: false,
  areaOptimal: false,
  adsMessage: false,
})

type CheckedField = keyof typeof errors

const leaseFields = [
  'fullName',
  'phone',
  'email',
  'website',
  'storesCount',
  'areaFrom',
  'areaTo',
  'areaOptimal',
] as const satisfies readonly CheckedField[]

const adsFields = ['fullName', 'phone', 'email', 'adsMessage'] as const satisfies readonly CheckedField[]
const selectedProfiles = ref<string[]>([])
const consentPersonal = ref(false)
const consentPolicies = ref(false)
const consentMailing = ref(false)
const fileName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const formEl = ref<HTMLFormElement | null>(null)

const presentationTo = computed(() =>
  presentationHref && presentationHref !== '#' ? presentationHref : undefined,
)

const requiredConsentsOk = computed(
  () => consentPersonal.value && consentPolicies.value,
)
const consentError = ref('')

watch(requiredConsentsOk, (ok) => {
  if (ok) consentError.value = ''
})

const activeFields = computed(() =>
  activeTab.value === 'ads' ? adsFields : leaseFields,
)

for (const field of leaseFields) {
  watch(
    () => form[field],
    () => {
      refresh(field)
    },
  )
}

watch(
  () => form.adsMessage,
  () => {
    refresh('adsMessage')
  },
)

watch(activeTab, () => {
  errors.adsMessage = ''
  touched.adsMessage = false
})

function isProfileSelected(id: string) {
  return selectedProfiles.value.includes(id)
}

function setProfile(id: string, checked: boolean) {
  if (checked) {
    if (!isProfileSelected(id)) {
      selectedProfiles.value = [...selectedProfiles.value, id]
    }
    return
  }

  selectedProfiles.value = selectedProfiles.value.filter((item) => item !== id)
}

function openFilePicker() {
  fileInput.value?.click()
}

function clearFile() {
  fileName.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  fileName.value = input.files?.[0]?.name ?? ''
}

function setFullName(value: string): void {
  applyMask('fullName', maskPersonName(value))
}

function fullNameMessage(value: string, isTouched: boolean): string {
  if (!isPersonNameChars(value)) return lettersError

  const trimmed = value.trim()

  if (!trimmed) return isTouched ? requiredError : ''
  if (!isTouched) return ''

  return isFullName(trimmed) ? '' : fullNameFormatError
}

function blockFullNameDigit(event: KeyboardEvent): void {
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (/^\p{Nd}$/u.test(event.key)) event.preventDefault()
}

function setPhone(value: string): void {
  applyMask('phone', maskPhone(value))
}

function blockPhoneKey(event: KeyboardEvent): void {
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (event.key.length === 1 && !/^\d$/u.test(event.key)) event.preventDefault()
}

/**
 * Насыщенная маска возвращает то же значение, что уже в форме: модель не меняется,
 * Vue поле не перерисовывает, и в нём остаётся сырой ввод (лишние цифры, символы).
 * Поэтому после маски приводим DOM к модели руками.
 */
function applyMask(field: 'fullName' | 'phone', value: string): void {
  form[field] = value

  const input = formEl.value?.querySelector<HTMLInputElement>(`input[name="${field}"]`)

  if (input && input.value !== value) {
    input.value = value
  }
}

function phoneMessage(value: string, isTouched: boolean): string {
  if (!isPhoneChars(value)) return phoneFormatError

  const trimmed = value.trim()

  if (!trimmed) return isTouched ? requiredError : ''
  if (!isPhone(trimmed)) return isTouched ? phoneFormatError : ''

  return ''
}

function emailMessage(value: string, isTouched: boolean): string {
  const trimmed = value.trim()

  if (!trimmed) return isTouched ? requiredError : ''
  if (!isTouched) return ''

  return isEmail(trimmed) ? '' : emailFormatError
}

function websiteMessage(value: string, isTouched: boolean): string {
  const trimmed = value.trim()

  if (!trimmed || !isTouched) return ''

  return isHttpUrl(trimmed) ? '' : urlFormatError
}

function countMessage(value: string, isTouched: boolean): string {
  if (!isNonNegativeIntChars(value)) return digitsError

  const trimmed = value.trim()

  if (!trimmed || !isTouched) return ''

  return isNonNegativeInt(trimmed) ? '' : intFormatError
}

function amountMessage(value: string, isTouched: boolean): string {
  if (!isPositiveAmountChars(value)) return digitsError

  const trimmed = value.trim()

  if (!trimmed || !isTouched) return ''

  return isPositiveAmount(trimmed) ? '' : amountFormatError
}

function areaToMessage(isTouched: boolean): string {
  const own = amountMessage(form.areaTo, isTouched)

  if (own) return own

  const from = parsePositiveAmount(form.areaFrom)
  const to = parsePositiveAmount(form.areaTo)

  if (from != null && to != null && from > to) return areaRangeError

  return ''
}

function adsTextMessage(isTouched: boolean): string {
  if (activeTab.value !== 'ads' || !isTouched) return ''

  return form.adsMessage.trim() ? '' : requiredError
}

function fieldMessage(field: CheckedField, isTouched: boolean): string {
  switch (field) {
    case 'fullName':
      return fullNameMessage(form.fullName, isTouched)
    case 'phone':
      return phoneMessage(form.phone, isTouched)
    case 'email':
      return emailMessage(form.email, isTouched)
    case 'website':
      return websiteMessage(form.website, isTouched)
    case 'storesCount':
      return countMessage(form.storesCount, isTouched)
    case 'areaFrom':
      return amountMessage(form.areaFrom, isTouched)
    case 'areaTo':
      return areaToMessage(isTouched)
    case 'areaOptimal':
      return amountMessage(form.areaOptimal, isTouched)
    case 'adsMessage':
      return adsTextMessage(isTouched)
  }
}

function refresh(field: CheckedField): void {
  if (field === 'areaFrom' || field === 'areaTo') {
    errors.areaFrom = fieldMessage('areaFrom', touched.areaFrom)
    errors.areaTo = fieldMessage('areaTo', touched.areaTo)
    return
  }

  errors[field] = fieldMessage(field, touched[field])
}

function touch(field: CheckedField): void {
  touched[field] = true
  refresh(field)
}

function validate(): boolean {
  for (const field of activeFields.value) {
    touched[field] = true
    refresh(field)
  }

  return activeFields.value.every((field) => errors[field] === '')
}

async function onSubmit(): Promise<void> {
  const fieldsOk = validate()

  consentError.value = requiredConsentsOk.value ? '' : requiredError

  if (!fieldsOk || consentError.value) {
    // Поля получают aria-invalid только после рендера — ждём кадр и уводим фокус к первой ошибке.
    await nextTick()
    formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }

  // Отправка появится после контракта API.
}
</script>

<template>
  <section :class="$style.root" aria-labelledby="tenants-apply-title">
    <h2 id="tenants-apply-title" :class="$style.title">
      {{ title }}
    </h2>

    <div
      :class="$style.tabs"
      role="tablist"
      aria-label="Тип заявки"
    >
      <UiTab
        :selected="activeTab === 'lease'"
        type="button"
        @click="activeTab = 'lease'"
      >
        Аренда помещений
      </UiTab>
      <UiTab
        :selected="activeTab === 'ads'"
        type="button"
        @click="activeTab = 'ads'"
      >
        Реклама
      </UiTab>
    </div>

    <div :class="$style.layout">
      <form
        ref="formEl"
        :class="$style.form"
        novalidate
        @submit.prevent="onSubmit"
      >
        <div :class="$style.fields">
          <div :class="$style.contactRows">
            <div :class="$style.row">
              <UiInput
                :model-value="form.fullName"
                name="fullName"
                autocomplete="name"
                placeholder="ФИО"
                label="ФИО"
                :error="errors.fullName"
                required
                @update:model-value="setFullName"
                @keydown="blockFullNameDigit"
                @blur="touch('fullName')"
              />
              <UiInput
                v-model="form.position"
                name="position"
                autocomplete="organization-title"
                placeholder="Должность"
                label="Должность"
              />
            </div>

            <div :class="$style.row">
              <UiInput
                :model-value="form.phone"
                type="tel"
                name="phone"
                autocomplete="tel"
                inputmode="tel"
                placeholder="Телефон"
                label="Телефон"
                :error="errors.phone"
                required
                @update:model-value="setPhone"
                @keydown="blockPhoneKey"
                @blur="touch('phone')"
              />
              <UiInput
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                inputmode="email"
                placeholder="Почта"
                label="Почта"
                :error="errors.email"
                required
                @blur="touch('email')"
              />
            </div>

            <div
              v-if="activeTab === 'lease'"
              :class="$style.row"
            >
              <UiInput
                v-model="form.website"
                type="url"
                name="website"
                autocomplete="url"
                placeholder="Сайт"
                label="Сайт"
                :error="errors.website"
                @blur="touch('website')"
              />
              <UiInput
                v-model="form.address"
                name="address"
                autocomplete="street-address"
                placeholder="Фактический адрес"
                label="Фактический адрес"
              />
            </div>
          </div>

          <template v-if="activeTab === 'lease'">
            <div :class="[$style.row, $style.rowLoose]">
              <div :class="$style.fieldGroup">
                <p :class="$style.fieldLabel">
                  Полное название компании:
                </p>
                <UiInput
                  v-model="form.company"
                  name="company"
                  autocomplete="organization"
                  placeholder="Введите название"
                  label="Полное название компании"
                />
              </div>
              <div :class="$style.fieldGroup">
                <p :class="$style.fieldLabel">
                  Количество открытых магазинов:
                </p>
                <UiInput
                  v-model="form.storesCount"
                  name="storesCount"
                  inputmode="numeric"
                  placeholder="Введите количество"
                  label="Количество открытых магазинов"
                  :error="errors.storesCount"
                  @blur="touch('storesCount')"
                />
              </div>
            </div>

            <div :class="$style.fieldGroup">
              <p :class="$style.fieldLabel">
                Товарный профиль (одежда, обувь, аксессуары, товары для детей и т.п.):
              </p>
              <UiInput
                v-model="form.productProfile"
                name="productProfile"
                placeholder="Введите профиль"
                label="Товарный профиль"
              />
            </div>

            <fieldset :class="$style.fieldset">
              <legend :class="$style.fieldLabel">
                Торговый профиль:
              </legend>
              <div :class="$style.profiles">
                <label
                  v-for="profile in tradeProfiles"
                  :key="profile.id"
                  :class="$style.profile"
                >
                  <UiCheckbox
                    :model-value="isProfileSelected(profile.id)"
                    @update:model-value="setProfile(profile.id, $event)"
                  />
                  <span>{{ profile.label }}</span>
                </label>
              </div>
            </fieldset>

            <div :class="$style.fieldGroup">
              <p :class="$style.fieldLabel">
                Торговые марки, предоставляемые Вашей компанией:
              </p>
              <UiInput
                v-model="form.brands"
                name="brands"
                placeholder="Перечислите марки"
                label="Торговые марки"
              />
            </div>

            <div :class="$style.fieldGroup">
              <p :class="$style.fieldLabel">
                В каких ТЦ представлены:
              </p>
              <UiInput
                v-model="form.malls"
                name="malls"
                placeholder="Перечислите названия ТЦ"
                label="В каких ТЦ представлены"
              />
            </div>

            <div :class="$style.fieldGroup">
              <p :class="$style.fieldLabel">
                Размер интересующей торговой площади в ТЦ (кв.м)
              </p>
              <div :class="[$style.row, $style.rowTriple]">
                <UiInput
                  v-model="form.areaFrom"
                  name="areaFrom"
                  inputmode="decimal"
                  placeholder="От"
                  label="Площадь от"
                  :error="errors.areaFrom"
                  @blur="touch('areaFrom')"
                />
                <UiInput
                  v-model="form.areaTo"
                  name="areaTo"
                  inputmode="decimal"
                  placeholder="До"
                  label="Площадь до"
                  :error="errors.areaTo"
                  @blur="touch('areaTo')"
                />
                <UiInput
                  v-model="form.areaOptimal"
                  name="areaOptimal"
                  inputmode="decimal"
                  placeholder="Оптимальный"
                  label="Оптимальная площадь"
                  :error="errors.areaOptimal"
                  @blur="touch('areaOptimal')"
                />
              </div>
            </div>
          </template>

          <div
            v-else
            :class="$style.fieldGroup"
          >
            <p :class="$style.fieldLabel">
              Описание рекламной заявки:
            </p>
            <UiTextarea
              v-model="form.adsMessage"
              name="adsMessage"
              rows="4"
              placeholder="Расскажите о формате и сроках размещения"
              label="Описание рекламной заявки"
              :error="errors.adsMessage"
              required
              @blur="touch('adsMessage')"
            />
          </div>
        </div>

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
            <span :class="$style.attachLabel">{{ fileName || 'Прикрепить файл' }}</span>
          </button>
          <button
            v-if="fileName"
            :class="$style.attachClear"
            type="button"
            aria-label="Удалить файл"
            @click="clearFile"
          >
            <UIcon
              name="local:cross"
              :class="$style.attachClearIcon"
              aria-hidden="true"
            />
          </button>
        </div>

        <div :class="$style.footer">
          <UiFormConsents
            v-model:personal="consentPersonal"
            v-model:policies="consentPolicies"
            v-model:mailing="consentMailing"
            :privacy-href="privacyHref"
            :error="consentError"
          />

          <UiButton type="submit">
            Отправить
          </UiButton>
        </div>
      </form>

      <aside :class="$style.contacts" aria-labelledby="tenants-contacts-title">
        <img
          :class="$style.contactsDecor"
          :src="contactsDecorSrc"
          alt=""
          width="366"
          height="365"
          aria-hidden="true"
          decoding="async"
        >
        <div :class="$style.contactsFade" aria-hidden="true" />

        <div :class="$style.contactsBody">
          <h3 id="tenants-contacts-title" :class="$style.contactsTitle">
            {{ contactsTitle }}
          </h3>

          <ul :class="$style.contactsList">
            <li :class="$style.contactsItem">
              <div :class="$style.contactsMeta">
                <UIcon
                  name="local:phone"
                  :class="$style.contactsIcon"
                  aria-hidden="true"
                />
                <span>{{ phoneLabel }}</span>
              </div>
              <a :class="$style.contactsValue" :href="phoneHref">
                {{ phoneDisplay }}
                <span :class="$style.contactsExt">{{ phoneExt }}</span>
              </a>
            </li>
            <li :class="$style.contactsItem">
              <div :class="$style.contactsMeta">
                <UIcon
                  name="local:message"
                  :class="$style.contactsIcon"
                  aria-hidden="true"
                />
                <span>{{ emailLabel }}</span>
              </div>
              <a :class="$style.contactsValue" :href="emailHref">
                {{ email }}
              </a>
            </li>
          </ul>
        </div>

        <div :class="$style.presentation">
          <p :class="$style.presentationNote">
            {{ presentationNote }}
          </p>
          <UiButton
            :class="$style.presentationBtn"
            :to="presentationTo"
          >
            {{ presentationLabel }}
          </UiButton>
        </div>
      </aside>
    </div>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);

  @include from-desktop {
    gap: rem(40);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  align-items: center;
}

.layout {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);

  @include from-desktop {
    flex-direction: row;
    gap: rem(156);
    align-items: flex-start;
  }
}

.form {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    gap: rem(40);
    max-width: rem(900);
  }
}

.fields {
  --tenants-field-gap: #{rem(12)};

  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);

  @include from-desktop {
    --tenants-field-gap: var(--fs-space-2);
  }
}

.contactRows {
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

.rowLoose {
  gap: var(--fs-space-3);

  @include from-tablet {
    gap: var(--fs-space-2);
  }
}

.rowTriple {
  grid-template-columns: repeat(2, minmax(0, 1fr));

  > :last-child {
    grid-column: 1 / -1;
  }

  @include from-tablet {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    > :last-child {
      grid-column: auto;
    }
  }
}

.fieldGroup {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--tenants-field-gap);
  min-width: 0;
}

.fieldLabel {
  margin: 0;
  @include fs-text-md;
}

.fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  /* legend не участвует в gap, поэтому отступ задаётся снаружи блока чекбоксов */
  > .fieldLabel {
    margin-bottom: var(--tenants-field-gap);
  }
}

.profiles {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--fs-space-2);

  @include from-tablet {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.profile {
  display: flex;
  gap: rem(12);
  align-items: flex-start;
  @include fs-text-lg;
  cursor: pointer;
}

.attach {
  position: relative;
  display: flex;
  gap: rem(12);
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

.fileInput {
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
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  background: transparent;
  cursor: pointer;
  appearance: none;

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
  align-items: flex-start;
}

.contacts {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  width: 100%;
  padding: var(--fs-space-2);
  border-radius: rem(24);
  background-color: var(--fs-color-light);
  overflow: clip;

  @include from-desktop {
    flex: 0 0 rem(504);
    gap: var(--fs-space-4);
    width: rem(504);
    padding: var(--fs-space-4);
    border-radius: rem(32);
  }
}

.contactsDecor {
  position: absolute;
  right: rem(-177);
  bottom: rem(214);
  width: rem(366);
  max-width: none;
  height: auto;
  pointer-events: none;

  @include from-desktop {
    right: rem(-172);
    bottom: rem(160);
  }
}

.contactsFade {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    50deg,
    var(--fs-color-light) 53%,
    rgb(243 242 237 / 0%) 90%
  );
  pointer-events: none;
}

.contactsBody,
.presentation {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.contactsTitle {
  @include fs-h3;
  margin: 0;
}

.contactsList {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.contactsItem {
  display: flex;
  flex-direction: column;
  gap: rem(8);
  align-items: flex-start;

  @include from-desktop {
    flex-direction: row;
  }
}

.contactsMeta {
  display: flex;
  flex-shrink: 0;
  gap: rem(4);
  align-items: center;
  width: rem(120);
  @include fs-text;
  color: var(--fs-color-gray);

  @include from-desktop {
    @include fs-text-lg;
  }
}

.contactsIcon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
  color: inherit;
}

.contactsValue {
  @include fs-text;
  color: var(--fs-color-black);
  text-decoration: none;
  overflow-wrap: break-word;

  @include from-desktop {
    @include fs-text-lg;
  }
}

.contactsExt {
  display: block;
}

.presentationNote {
  margin: 0;
  @include fs-text;
  overflow-wrap: break-word;

  @include from-desktop {
    @include fs-text-lg;
  }
}

.presentationBtn {
  width: 100%;
}
</style>
