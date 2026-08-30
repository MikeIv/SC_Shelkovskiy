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
            <UiLogo aria-hidden="true" />
          </NuxtLink>
          <p :class="$style.address">
            {{ footerContacts.address }}
          </p>
        </div>

        <nav :class="[$style.nav, $style.navPrimary]" aria-label="О центре">
          <ul :class="$style.navList">
            <li v-for="item in footerNavPrimary" :key="item.to">
              <NuxtLink :class="$style.navLink" :to="item.to">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav :class="[$style.nav, $style.navSecondary]" aria-label="Сервисы">
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
    border-top-left-radius: calc(var(--fs-space-6) + var(--fs-space-2));
    border-top-right-radius: calc(var(--fs-space-6) + var(--fs-space-2));
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
      calc(var(--fs-space-6) + var(--fs-space-4))
      var(--fs-grid-margin)
      var(--fs-space-5);
  }
}

.grid {
  display: grid;
  /* Пропорции колонок — шаблон Figma, масштабируются через fr */
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
    grid-template-columns:
      minmax(0, 306fr)
      minmax(0, 297fr)
      minmax(0, 101fr)
      minmax(0, 504fr);
    grid-template-areas:
      'brand nav-a nav-b newsletter'
      'contact nav-a nav-b newsletter';
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
  min-width: 0;

  @include from-desktop {
    gap: var(--fs-space-3);
  }
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
  gap: var(--fs-space-2);
  align-items: flex-start;
}

.consentCheck {
  flex-shrink: 0;
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
  margin: var(--fs-space-5) 0 var(--fs-space-2);
  border: 0;
  border-top: rem(2) solid var(--fs-color-black);

  @include from-tablet {
    margin-block: var(--fs-space-6) var(--fs-space-4);
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
