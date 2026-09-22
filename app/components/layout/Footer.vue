<script setup lang="ts">
import { NuxtLink } from '#components'
import type { FooterNavItem } from '~/utils/siteFooter'

const email = ref('')
const consent = ref(false)
const newsletterStatus = ref<'idle' | 'need-consent' | 'soon'>('idle')
const consentId = useId()
const consentLabelId = useId()

function navBind(to: FooterNavItem['to']) {
  return to ? { to } : {}
}

function onNewsletterSubmit() {
  if (!consent.value) {
    newsletterStatus.value = 'need-consent'
    return
  }

  // API подписки нет — честный статус, без ложного «сохранили».
  newsletterStatus.value = 'soon'
}
</script>

<template>
  <footer :class="$style.root">
    <div :class="$style.inner">
      <div :class="$style.grid">
        <div :class="$style.brand">
          <NuxtLink :class="$style.logoLink" to="/" aria-label="Щёлковский">
            <UiLogo aria-hidden="true" />
          </NuxtLink>
          <p :class="$style.address">
            {{ footerContacts.address }}
          </p>
        </div>

        <nav :class="[$style.nav, $style.navPrimary]" aria-label="О центре">
          <ul :class="$style.navList">
            <li v-for="item in footerNavPrimary" :key="item.label">
              <component
                :is="item.to ? NuxtLink : 'span'"
                :class="$style.navLink"
                v-bind="navBind(item.to)"
              >
                {{ item.label }}
              </component>
            </li>
          </ul>
        </nav>

        <nav :class="[$style.nav, $style.navSecondary]" aria-label="Сервисы">
          <ul :class="$style.navList">
            <li v-for="item in footerNavSecondary" :key="item.label">
              <component
                :is="item.to ? NuxtLink : 'span'"
                :class="$style.navLink"
                v-bind="navBind(item.to)"
              >
                {{ item.label }}
              </component>
            </li>
          </ul>
        </nav>

        <section :class="$style.newsletter" aria-labelledby="footer-newsletter-title">
          <h2 id="footer-newsletter-title" :class="$style.newsletterTitle">
            Подписаться на рассылку
          </h2>
          <form :class="$style.newsletterForm" @submit.prevent="onNewsletterSubmit">
            <UiInput
              v-model="email"
              :class="$style.newsletterInput"
              variant="white"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="Почта"
              label="Почта"
              required
            />
            <div :class="$style.consent">
              <UiCheckbox
                :id="consentId"
                v-model="consent"
                :class="$style.consentCheck"
                :aria-labelledby="consentLabelId"
              />
              <p :id="consentLabelId" :class="$style.consentText">
                <label :for="consentId">Соглашаюсь с</label>
                {{ ' ' }}
                <component
                  :is="footerContacts.privacyHref ? NuxtLink : 'span'"
                  :class="$style.consentLink"
                  v-bind="navBind(footerContacts.privacyHref)"
                >
                  политикой конфиденциальности
                </component>
                и
                <component
                  :is="footerContacts.privacyHref ? NuxtLink : 'span'"
                  :class="$style.consentLink"
                  v-bind="navBind(footerContacts.privacyHref)"
                >
                  обработки персональных данных
                </component>
              </p>
            </div>
            <p
              v-if="newsletterStatus !== 'idle'"
              :class="$style.newsletterStatus"
              role="status"
              aria-live="polite"
            >
              <template v-if="newsletterStatus === 'need-consent'">
                Нужно согласие на обработку персональных данных
              </template>
              <template v-else>
                Подписка скоро появится — адрес пока не сохраняем
              </template>
            </p>
            <UiButton :class="$style.newsletterBtn" type="submit">
              Подписаться
            </UiButton>
          </form>
        </section>

        <div :class="$style.contact">
          <a :class="$style.contactLink" :href="footerContacts.phoneHref">
            {{ footerContacts.phone }}
          </a>
          <a :class="$style.contactLink" :href="footerContacts.emailHref">
            {{ footerContacts.email }}
          </a>
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

      <hr :class="$style.divider">

      <div :class="$style.bottom">
        <p :class="$style.copyright">
          {{ footerContacts.copyright }}
        </p>
        <component
          :is="footerContacts.privacyHref ? NuxtLink : 'span'"
          :class="$style.privacyLink"
          v-bind="navBind(footerContacts.privacyHref)"
        >
          {{ footerContacts.privacyLabel }}
        </component>
      </div>
    </div>
  </footer>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  z-index: z('default');
  margin-top: auto;
  color: var(--fs-color-black);
  background-color: var(--fs-color-light);
  border-top-left-radius: var(--fs-space-4);
  border-top-right-radius: var(--fs-space-4);

  @include from-desktop {
    border-top-left-radius: calc(var(--fs-space-6) + var(--fs-space-2));
    border-top-right-radius: calc(var(--fs-space-6) + var(--fs-space-2));
  }
}

.inner {
  --footer-pad-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  width: 100%;
  padding: var(--fs-space-6) var(--footer-pad-inline) var(--fs-space-6);

  @include from-desktop {
    padding-block: rem(80);
  }
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 172fr) minmax(0, 101fr);
  grid-template-areas:
    'brand brand'
    'nav-a nav-b'
    'newsletter newsletter'
    'contact contact';
  column-gap: var(--fs-space-3);
  row-gap: var(--fs-space-6);

  @include from-tablet {
    grid-template-columns: minmax(0, 334fr) minmax(0, 172fr) minmax(0, 101fr);
    grid-template-areas:
      'brand nav-a nav-b'
      'contact nav-a nav-b'
      'newsletter newsletter newsletter';
    row-gap: var(--fs-space-4);
  }

  @include from-desktop {
    /* Сетка 12 кол.: 3 + 3 + 2 + 4 (Figma 306 / 297 / 101 / 504 при gutter 24). */
    @include fs-grid;
    grid-template-areas:
      'brand brand brand nav-a nav-a nav-a nav-b nav-b newsletter newsletter newsletter newsletter'
      'contact contact contact nav-a nav-a nav-a nav-b nav-b newsletter newsletter newsletter newsletter';
    row-gap: var(--fs-space-5);
    align-items: start;
  }
}

.brand {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  grid-area: brand;
  min-width: 0;
}

.logoLink {
  display: inline-flex;
  width: fit-content;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.address {
  margin: 0;
  @include fs-text-lg;
}

.navPrimary {
  grid-area: nav-a;
}

.navSecondary {
  grid-area: nav-b;
}

.navPrimary,
.navSecondary {
  min-width: 0;

  @include from-tablet {
    grid-row: 1 / 3;
    align-self: start;
  }
}

.navList {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.navLink {
  @include fs-text-lg;
  color: inherit;
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
      text-underline-offset: rem(2);
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.contact {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  grid-area: contact;
  min-width: 0;

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.contactLink {
  @include fs-h4;
  color: inherit;
  text-decoration: none;
  word-break: break-word;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
      text-underline-offset: rem(2);
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.socialList {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.socialLink {
  display: block;
  flex-shrink: 0;
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

.newsletter {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  grid-area: newsletter;
  min-width: 0;
}

.newsletterTitle {
  margin: 0;
  @include fs-h4;
}

.newsletterForm {
  display: grid;
  grid-template-areas:
    'input'
    'consent'
    'status'
    'btn';
  gap: var(--fs-space-2);

  @include from-tablet {
    grid-template-areas:
      'input btn'
      'consent consent'
      'status status';
    grid-template-columns: minmax(0, 1fr) auto;
  }

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.newsletterInput {
  grid-area: input;
  min-width: 0;
}

.newsletterBtn {
  grid-area: btn;
  width: 100%;

  @include from-tablet {
    width: auto;
    align-self: stretch;
  }
}

.newsletterStatus {
  grid-area: status;
  margin: 0;
  @include fs-text-sm;
  color: var(--fs-color-black);
}

.consent {
  display: flex;
  grid-area: consent;
  gap: rem(12); /* Figma: 12px между чекбоксом и текстом */
  align-items: flex-start;
}

.consentCheck {
  flex-shrink: 0;
}

.consentText {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);

  label {
    cursor: pointer;
  }
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

.divider {
  margin-block: var(--fs-space-5);
  /* Mobile/tablet: край в край (Figma). Desktop: по контенту 1560. */
  margin-inline: calc(-1 * var(--footer-pad-inline));
  border: 0;
  /* Figma: белая 2px на --fs-color-light, не чёрная. */
  border-top: rem(2) solid var(--fs-color-white);

  @include from-tablet {
    margin-block: var(--fs-space-6);
  }

  @include from-desktop {
    margin-block: rem(80) var(--fs-space-5);
    margin-inline: 0;
  }
}

.bottom {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--fs-space-5);

  @include from-tablet {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--fs-space-3);
  }
}

.copyright,
.privacyLink {
  margin: 0;
  @include fs-text-lg;
}

.privacyLink {
  color: inherit;
  text-decoration: none;

  @include from-tablet {
    white-space: nowrap;
  }

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
      text-underline-offset: rem(2);
    }
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}
</style>
