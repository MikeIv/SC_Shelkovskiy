<script setup lang="ts">
import type {
  ContactsDepartment,
  ContactsFeedbackContent,
  ContactsHoursRange,
  ContactsPageContent,
} from '#shared/types/contacts'
import { footerSocialLinks } from '~/utils/siteFooter'

const { content, hours, departments, feedback } = defineProps<{
  content: ContactsPageContent
  hours: ContactsHoursRange[]
  departments: ContactsDepartment[]
  feedback: ContactsFeedbackContent
}>()

const isFeedbackOpen = ref(false)

const labels = {
  phone: 'Телефон',
  email: 'Почта',
  hours: 'Режим работы',
  social: 'Социальные сети',
} as const
</script>

<template>
  <section :class="$style.root" aria-labelledby="contacts-title">
    <div :class="$style.main">
      <div :class="$style.intro">
        <h1 id="contacts-title" :class="$style.title">
          {{ content.title }}
        </h1>

        <div :class="$style.addressRow">
          <p :class="$style.address">{{ content.address }}</p>
          <span
            :class="$style.metro"
            :aria-label="`Станция метро ${content.metroLabel}`"
          >
            <span :class="$style.metroBadge" aria-hidden="true">
              <img
                :class="$style.metroIcon"
                :src="content.metroIconSrc"
                alt=""
                width="12"
                height="7"
              >
            </span>
            <span :class="$style.metroLabel" aria-hidden="true">
              {{ content.metroLabel }}
            </span>
          </span>
        </div>
      </div>

      <div :class="$style.general">
        <div :class="$style.generalCol">
          <div :class="$style.row">
            <span :class="$style.label">{{ labels.phone }}</span>
            <a :class="$style.value" :href="content.phoneHref">
              {{ content.phone }}
            </a>
          </div>

          <div :class="$style.block">
            <span :class="$style.label">{{ labels.hours }}</span>
            <ul :class="$style.hours">
              <li
                v-for="item in hours"
                :key="item.id"
                :class="$style.hoursItem"
              >
                <span>{{ item.days }}</span>
                <span>{{ item.time }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div :class="$style.generalCol">
          <div :class="$style.row">
            <span :class="$style.label">{{ labels.email }}</span>
            <a :class="$style.value" :href="content.emailHref">
              {{ content.email }}
            </a>
          </div>

          <div :class="$style.block">
            <span :class="$style.label">{{ labels.social }}</span>
            <ul :class="$style.socialList">
              <li v-for="item in footerSocialLinks" :key="item.label">
                <a
                  :class="$style.socialLink"
                  :href="item.href"
                  :aria-label="item.label"
                  rel="noopener noreferrer"
                  target="_blank"
                  :style="item.hoverColor
                    ? { '--social-hover': item.hoverColor }
                    : undefined"
                >
                  <UIcon
                    :name="item.icon"
                    :class="$style.socialIcon"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr :class="$style.divider">

      <ul :class="$style.departments">
        <li
          v-for="item in departments"
          :key="item.id"
          :class="$style.department"
        >
          <h2 :class="$style.departmentTitle">{{ item.title }}</h2>
          <div :class="$style.departmentBody">
            <div :class="[$style.row, $style.rowStart]">
              <span :class="$style.label">{{ labels.phone }}</span>
              <a
                :class="[$style.value, $style.phoneStack]"
                :href="item.phoneHref"
              >
                <span>{{ item.phone }}</span>
                <span>{{ item.phoneExt }}</span>
              </a>
            </div>
            <div :class="$style.row">
              <span :class="$style.label">{{ labels.email }}</span>
              <a :class="$style.value" :href="item.emailHref">
                {{ item.email }}
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <aside :class="$style.aside" aria-label="Карта и помощь">
      <div :class="$style.mapWrap">
        <img
          :class="$style.map"
          :src="content.mapSrc"
          :alt="content.mapAlt"
          width="634"
          height="443"
          decoding="async"
        >
      </div>

      <div :class="$style.help">
        <div :class="$style.helpCopy">
          <p :class="$style.helpTitle">{{ content.helpTitle }}</p>
          <p :class="$style.helpText">{{ content.helpText }}</p>
        </div>
        <UiButton type="button" @click="isFeedbackOpen = true">
          {{ content.helpCtaLabel }}
        </UiButton>
      </div>
    </aside>
  </section>

  <ContactsFeedbackModal
    :open="isFeedbackOpen"
    :content="feedback"
    @close="isFeedbackOpen = false"
  />
</template>

<style module lang="scss">
@use 'tools' as *;

/* Цвет линии метро «Щёлковская» (Figma). */
$metro-blue: #007ac6;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    flex-direction: row;
    gap: rem(80);
    align-items: flex-start;
    justify-content: space-between;
  }

  @include from-wide {
    gap: rem(156);
  }
}

.main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    max-width: rem(768);
    gap: rem(48);
  }
}

.intro {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.title {
  @include fs-h1;
  margin: 0;
}

.addressRow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2) var(--fs-space-3);
  align-items: center;
}

.address {
  margin: 0;
  @include fs-h3;
}

.metro {
  display: inline-flex;
  gap: rem(12);
  align-items: center;
  height: rem(35);
  padding: rem(8) rem(16) rem(8) rem(8);
  background-color: var(--fs-color-light);
  border-radius: rem(100);
}

.metroBadge {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(20);
  height: rem(20);
  background-color: $metro-blue;
  border-radius: rem(100);
}

.metroIcon {
  display: block;
  width: rem(12);
  height: rem(7);
}

.metroLabel {
  @include fs-text-sm;
  color: var(--fs-color-black);
}

.general {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);

  @include from-tablet {
    flex-direction: row;
    gap: rem(24);
  }
}

.generalCol {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;

  @include from-desktop {
    gap: rem(16);
  }
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: rem(8);
  align-items: center;
}

.rowStart {
  align-items: flex-start;
}

.block {
  display: flex;
  flex-direction: column;
  gap: rem(8);
}

.label {
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

.value {
  @include fs-text-lg;
  color: var(--fs-color-black);
  text-decoration: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.phoneStack {
  display: flex;
  flex-direction: column;
}

.hours {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-3) rem(48);
  margin: 0;
  padding: 0;
  list-style: none;
}

.hoursItem {
  display: flex;
  flex-direction: column;
  @include fs-text-lg;
  color: var(--fs-color-black);
}

.socialList {
  display: flex;
  flex-wrap: wrap;
  gap: rem(16);
  margin: 0;
  padding: 0;
  list-style: none;
}

.socialLink {
  display: block;
  line-height: 0;
  color: var(--fs-color-black);
  border-radius: 50%;
  transition: color 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    color: var(--social-hover, var(--fs-color-beige));
  }

  &:focus-visible {
    color: var(--social-hover, var(--fs-color-beige));
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.socialIcon {
  display: block;
  width: rem(44);
  height: rem(44);
  color: inherit;
}

.divider {
  width: 100%;
  height: 0;
  margin: 0;
  border: 0;
  border-top: rem(2) solid var(--fs-color-light);
}

.departments {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--fs-space-4);
  margin: 0;
  padding: 0;
  list-style: none;

  @include from-tablet {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: rem(48) rem(24);
  }
}

.department,
.departmentBody {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  min-width: 0;

  @include from-desktop {
    gap: rem(16);
  }
}

.departmentTitle {
  @include fs-h3;
  margin: 0;
}

.aside {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
  min-width: 0;

  @include from-desktop {
    flex: 0 1 rem(520);
    max-width: rem(636);
    gap: rem(16);
  }
}

.mapWrap {
  width: 100%;
  overflow: clip;
  border-radius: rem(32);
  aspect-ratio: 634 / 443;

  @include from-desktop {
    border-radius: rem(60);
  }
}

.map {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.help {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;
  padding: var(--fs-space-3);
  background-color: var(--fs-color-light);
  border-radius: rem(24);

  @include from-desktop {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: rem(24);
    border-radius: rem(32);
  }
}

.helpCopy {
  display: flex;
  flex-direction: column;
  gap: rem(8);
}

.helpTitle {
  @include fs-h3;
  margin: 0;
}

.helpText {
  margin: 0;
  @include fs-text-lg;
}
</style>
