<script setup lang="ts">
import type { TenantDetail } from '#shared/types/tenantDetail'

defineProps<{
  item: TenantDetail
}>()
</script>

<template>
  <article
    :class="$style.root"
    :data-has-gallery="item.gallery?.length ? '' : undefined"
  >
    <header :class="$style.header">
      <h1 :class="$style.title">{{ item.title }}</h1>
      <p :class="$style.category">{{ item.category }}</p>
    </header>

    <NewsDetailGallery
      v-if="item.gallery?.length"
      :class="$style.gallery"
      size="tenant"
      :images="item.gallery"
      :alt="item.galleryAlt || item.title"
    />

    <div :class="$style.info">
      <NuxtLink :class="$style.mapCard" :to="item.mapUrl">
        <div :class="$style.logo">
          <img
            v-if="item.logoSrc"
            :class="$style.logoImage"
            :src="item.logoSrc"
            :alt="item.logoAlt || item.title"
          >
          <UiLogo v-else :class="$style.logoFallback" />
        </div>

        <div :class="$style.mapInfo">
          <UiTag variant="other">{{ item.floor }}</UiTag>
          <UiIconLink icon="local:map">Смотреть на схеме</UiIconLink>
        </div>
      </NuxtLink>

      <div v-if="item.phone || item.website" :class="$style.contacts">
        <div v-if="item.phone" :class="$style.contact">
          <span :class="$style.contactLabel">
            <UIcon name="local:phone" :class="$style.contactIcon" aria-hidden="true" />
            Телефон
          </span>
          <a
            v-if="item.phoneHref"
            :class="$style.contactValue"
            :href="item.phoneHref"
          >
            {{ item.phone }}
          </a>
          <span v-else :class="$style.contactValue">{{ item.phone }}</span>
        </div>

        <div v-if="item.website" :class="$style.contact">
          <span :class="$style.contactLabel">
            <UIcon name="local:globe" :class="$style.contactIcon" aria-hidden="true" />
            Сайт
          </span>
          <a
            :class="$style.contactValue"
            :href="item.website"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.website }}
          </a>
        </div>
      </div>
    </div>

    <section
      v-if="item.about?.length"
      :class="$style.about"
      aria-labelledby="tenant-about-title"
    >
      <h2 id="tenant-about-title" :class="$style.aboutTitle">
        {{ item.aboutTitle || 'О бренде' }}
      </h2>
      <div :class="$style.aboutText">
        <p v-for="(paragraph, index) in item.about" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </section>
  </article>
</template>

<style module lang="scss">
@use 'tools' as *;

/* Mob: title → gallery → info → about (Figma 971:52108). Desk: текст слева, gallery sticky справа. */
.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  width: 100%;

  @include from-desktop {
    display: grid;
    grid-template-columns: minmax(0, rem(768));
    gap: var(--fs-space-6) var(--fs-space-3);
    align-items: start;
    justify-content: space-between;

    &[data-has-gallery] {
      grid-template-columns: minmax(0, rem(768)) minmax(0, rem(768));
    }
  }
}

.header {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  min-width: 0;

  @include from-desktop {
    grid-column: 1;
  }
}

.title {
  margin: 0;
  @include fs-h1;
  color: var(--fs-color-black);
}

.category {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

.gallery {
  min-width: 0;

  @include from-desktop {
    position: sticky;
    top: var(--fs-space-5);
    grid-column: 2;
    grid-row: 1 / -1;
  }
}

.info {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;
  min-width: 0;

  @include from-tablet {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--fs-space-5);
    align-items: center;
  }

  @include from-desktop {
    grid-column: 1;
  }
}

.mapCard {
  display: inline-flex;
  gap: var(--fs-space-2);
  align-items: center;
  max-width: 100%;
  padding: var(--fs-space-2) var(--fs-space-3) var(--fs-space-2) var(--fs-space-2);
  overflow: clip;
  color: inherit;
  text-decoration: none;
  background-color: var(--fs-color-light);
  border-radius: rem(24);

  @include from-desktop {
    border-radius: rem(32);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.logo {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(80);
  height: rem(80);
  overflow: clip;
  background-color: var(--fs-color-white);
  border-radius: rem(16);

  @include from-desktop {
    width: rem(100);
    height: rem(100);
  }
}

.logoImage {
  display: block;
  width: rem(68);
  height: rem(68);
  object-fit: contain;
  object-position: center;

  @include from-desktop {
    width: rem(72);
    height: rem(72);
  }
}

.logoFallback {
  width: rem(56);
  opacity: 0.25;
}

.mapInfo {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  align-items: flex-start;
}

.contacts {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;
  justify-content: center;
}

.contact {
  display: flex;
  flex-wrap: wrap;
  gap: rem(8);
  align-items: center;
}

.contactLabel {
  display: inline-flex;
  gap: rem(4);
  align-items: center;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

.contactIcon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
  color: inherit;
}

.contactValue {
  @include fs-text-lg;
  color: var(--fs-color-black);
  text-decoration: none;
  overflow-wrap: anywhere;

  &[href]:hover {
    text-decoration: underline;
  }

  &[href]:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.about {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  /* Top→About в Figma 40: gap root 24 + 16 */
  margin-top: var(--fs-space-2);
  min-width: 0;

  @include from-desktop {
    margin-top: 0;
    gap: var(--fs-space-3);
    grid-column: 1;
  }
}

.aboutTitle {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
}

.aboutText {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);

  p {
    margin: 0;
    @include fs-text-lg;
    color: var(--fs-color-black);
  }
}
</style>
