<script setup lang="ts">
import type { TenantsFormTab, TenantsTradeProfile } from '#shared/types/tenants'

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
const selectedProfiles = ref<string[]>([])
const consent = ref(false)
const fileName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const presentationTo = computed(() =>
  presentationHref && presentationHref !== '#' ? presentationHref : undefined,
)

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

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  fileName.value = input.files?.[0]?.name ?? ''
}

function onSubmit() {
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
        :class="$style.form"
        @submit.prevent="onSubmit"
      >
        <div :class="$style.fields">
          <div :class="$style.row">
            <UiInput
              v-model="form.fullName"
              name="fullName"
              autocomplete="name"
              placeholder="ФИО"
              label="ФИО"
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

          <template v-if="activeTab === 'lease'">
            <div :class="$style.row">
              <UiInput
                v-model="form.website"
                type="url"
                name="website"
                autocomplete="url"
                placeholder="Сайт"
                label="Сайт"
              />
              <UiInput
                v-model="form.address"
                name="address"
                autocomplete="street-address"
                placeholder="Фактический адрес"
                label="Фактический адрес"
              />
            </div>

            <div :class="$style.row">
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
                />
                <UiInput
                  v-model="form.areaTo"
                  name="areaTo"
                  inputmode="decimal"
                  placeholder="До"
                  label="Площадь до"
                />
                <UiInput
                  v-model="form.areaOptimal"
                  name="areaOptimal"
                  inputmode="decimal"
                  placeholder="Оптимальный"
                  label="Оптимальная площадь"
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
            <span>{{ fileName || 'Прикрепить файл' }}</span>
          </button>
        </div>

        <div :class="$style.footer">
          <label :class="$style.consent">
            <UiCheckbox v-model="consent" />
            <span :class="$style.consentText">
              Даю согласие на
              <NuxtLink :class="$style.consentLink" :to="privacyHref">
                обработку персональных данных
              </NuxtLink>
            </span>
          </label>

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
            <li :class="[$style.contactsItem, $style.contactsItemMail]">
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
  gap: var(--fs-space-5);

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
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
}

.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--fs-space-2);

  @include from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.rowTriple {
  @include from-tablet {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.fieldGroup {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;
}

.fieldLabel {
  margin: 0;
  @include fs-text-md;
}

.fieldset {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
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
  display: flex;
  flex-direction: column;
  gap: rem(8);
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
  gap: var(--fs-space-3);
  align-items: flex-start;
  justify-content: space-between;

  @include from-desktop {
    flex-direction: row;
    align-items: center;
  }
}

.consent {
  display: flex;
  flex: 1 1 auto;
  gap: rem(12);
  align-items: flex-start;
  max-width: rem(520);
  cursor: pointer;
}

.consentText {
  @include fs-text-lg;
}

.consentLink {
  color: inherit;
  text-underline-offset: rem(2);
}

.contacts {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  width: 100%;
  padding: var(--fs-space-4);
  overflow: clip;
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-desktop {
    flex: 0 0 rem(504);
    width: rem(504);
  }
}

.contactsDecor {
  position: absolute;
  right: rem(-172);
  bottom: rem(160);
  width: rem(366);
  height: auto;
  pointer-events: none;
}

.contactsFade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(
    36deg,
    var(--fs-color-light) 53%,
    rgb(243 242 237 / 0%) 90%
  );
}

.contactsBody,
.presentation {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  width: 100%;
}

.contactsTitle {
  @include fs-h3;
  margin: 0;
}

.contactsList {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.contactsItem {
  display: flex;
  gap: rem(8);
  align-items: flex-start;
}

.contactsItemMail {
  align-items: center;
}

.contactsMeta {
  display: flex;
  flex-shrink: 0;
  gap: rem(4);
  align-items: center;
  width: rem(120);
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

.contactsIcon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}

.contactsValue {
  @include fs-text-lg;
  color: var(--fs-color-black);
  text-decoration: none;
  overflow-wrap: break-word;
}

.contactsExt {
  display: block;
}

.presentationNote {
  margin: 0;
  @include fs-text-lg;
  overflow-wrap: break-word;
}

.presentationBtn {
  width: 100%;
}
</style>
