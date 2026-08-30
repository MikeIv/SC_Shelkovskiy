<script setup lang="ts">
const email = ref('')
const consent = ref(false)
</script>

<template>
  <footer :class="$style.root">
    <div :class="$style.inner">
      <div :class="$style.grid">
        <div :class="$style.brand">
          <NuxtLink :class="$style.logoLink" to="/" aria-label="Щёлковский">
            <UiLogo :class="$style.logo" aria-hidden="true" />
          </NuxtLink>
          <p :class="$style.address">
            {{ footerContacts.address }}
          </p>
        </div>

        <nav :class="$style.nav" aria-label="О центре">
          <ul :class="$style.navList">
            <li v-for="item in footerNavPrimary" :key="item.to">
              <NuxtLink :class="$style.navLink" :to="item.to">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav :class="$style.nav" aria-label="Сервисы">
          <ul :class="$style.navList">
            <li v-for="item in footerNavSecondary" :key="item.to">
              <NuxtLink :class="$style.navLink" :to="item.to">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <section :class="$style.newsletter" aria-labelledby="footer-newsletter-title">
          <h2 id="footer-newsletter-title" :class="$style.newsletterTitle">
            Подписаться на рассылку
          </h2>
          <form :class="$style.newsletterForm" @submit.prevent>
            <UiInput
              v-model="email"
              :class="$style.newsletterInput"
              variant="white"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="Почта"
              label="Почта"
            />
            <div :class="$style.consent">
              <UiCheckbox v-model="consent" :class="$style.consentCheck" />
              <p :class="$style.consentText">
                Соглашаюсь с
                <NuxtLink :class="$style.consentLink" :to="footerContacts.privacyHref">
                  политикой конфиденциальности
                </NuxtLink>
                и
                <NuxtLink :class="$style.consentLink" :to="footerContacts.privacyHref">
                  обработки персональных данных
                </NuxtLink>
              </p>
            </div>
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
              >
                <img
                  :class="$style.socialIcon"
                  :src="item.icon"
                  alt=""
                  width="44"
                  height="44"
                >
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
        <NuxtLink :class="$style.privacyLink" :to="footerContacts.privacyHref">
          {{ footerContacts.privacyLabel }}
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  margin-top: auto;
  color: var(--fs-color-black);
  background-color: var(--fs-color-light);
  border-top-left-radius: var(--fs-space-4);
  border-top-right-radius: var(--fs-space-4);

  @include from-desktop {
    border-top-left-radius: rem(60);
    border-top-right-radius: rem(60);
  }
}

.inner {
  width: 100%;
  max-width: var(--fs-grid-content-max);
  margin-inline: auto;
  padding:
    var(--fs-space-6)
    var(--fs-grid-margin)
    var(--fs-space-4);

  @include from-desktop {
    padding:
      rem(80)
      max(var(--fs-grid-margin), calc((100% - var(--fs-grid-content-max)) / 2))
      var(--fs-space-5);
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
    grid-template-columns: rem(334) rem(172) rem(101);
    grid-template-areas:
      'brand nav-a nav-b'
      'contact nav-a nav-b'
      'newsletter newsletter newsletter';
    justify-content: start;
    row-gap: rem(34);
  }

  @include from-desktop {
    grid-template-columns: rem(306) rem(297) rem(101) minmax(0, 1fr);
    grid-template-areas:
      'brand nav-a nav-b newsletter'
      'contact nav-a nav-b newsletter';
    justify-content: initial;
    column-gap: var(--fs-space-3);
    row-gap: var(--fs-space-3);
    align-items: start;
  }
}

.brand {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  grid-area: brand;
}

.logoLink {
  display: inline-flex;
  width: fit-content;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.logo {
  width: rem(237);

  @include from-desktop {
    width: rem(290);
  }
}

.address {
  margin: 0;
  @include fs-text-lg;

  @include from-tablet {
    max-width: rem(207);
  }

  @include from-desktop {
    max-width: rem(220);
  }
}

.nav {
  &:first-of-type {
    grid-area: nav-a;
  }

  &:last-of-type {
    grid-area: nav-b;

    @include from-tablet {
      margin-left: rem(83);
    }

    @include from-desktop {
      margin-left: 0;
    }
  }

  @include from-tablet {
    &:first-of-type,
    &:last-of-type {
      grid-row: 1 / 3;
      align-self: start;
    }
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

  @include from-desktop {
    gap: var(--fs-space-3);
    padding-top: rem(42);
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
  border-radius: 50%;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.socialIcon {
  display: block;
  width: rem(44);
  height: rem(44);
}

.newsletter {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  grid-area: newsletter;
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
    'btn';
  gap: var(--fs-space-2);

  @include from-tablet {
    grid-template-areas:
      'input btn'
      'consent consent';
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: var(--fs-space-2);
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

.consent {
  display: flex;
  grid-area: consent;
  gap: rem(12);
  align-items: flex-start;
}

.consentCheck {
  flex-shrink: 0;
  margin-top: rem(2);
}

.consentText {
  margin: 0;
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

.divider {
  margin: rem(40) 0 var(--fs-space-2);
  border: 0;
  border-top: rem(2) solid var(--fs-color-black);

  @include from-tablet {
    margin-top: rem(48);
    margin-bottom: var(--fs-space-4);
  }

  @include from-desktop {
    margin-block: var(--fs-space-5) var(--fs-space-4);
  }
}

.bottom {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--fs-space-2);

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
