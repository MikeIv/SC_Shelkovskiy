<script setup lang="ts">
import type { NewsDetailItem } from '#shared/types/news'

defineProps<{
  item: NewsDetailItem
}>()

async function sharePage() {
  const url = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({ url })
      return
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
    }
  } catch {
    // Пользователь отменил шаринг или браузер не поддерживает API.
  }
}
</script>

<template>
  <div :class="$style.root">
    <header :class="$style.header">
      <div :class="$style.meta">
        <UiTag :variant="item.tagVariant">{{ item.tagLabel }}</UiTag>
        <UiTag
          v-if="item.period"
          variant="period"
          icon="local:calendar"
        >
          Срок акции: {{ item.period }}
        </UiTag>
        <time
          v-else
          :class="$style.date"
          :datetime="item.publishedAt ?? item.date"
        >
          {{ item.publishedAt ?? item.date }}
        </time>
      </div>

      <h1 :class="$style.title">{{ item.title }}</h1>
    </header>

    <div :class="$style.layout">
      <div :class="$style.content">
        <div v-if="item.tenant" :class="$style.tenant">
          <div :class="$style.tenantLogo">
            <img
              v-if="item.tenant.logoSrc"
              :class="$style.tenantLogoImage"
              :src="item.tenant.logoSrc"
              :alt="item.tenant.logoAlt || item.category"
            >
            <UiLogo v-else :class="$style.tenantLogoFallback" />
          </div>

          <div :class="$style.tenantInfo">
            <UiTag v-if="item.tenant.floor" variant="other">{{ item.tenant.floor }}</UiTag>

            <NuxtLink
              v-if="item.tenant.mapUrl"
              :class="$style.mapLink"
              :to="item.tenant.mapUrl"
            >
              <UIcon name="local:map" :class="$style.mapIcon" aria-hidden="true" />
              <span>Смотреть на схеме</span>
            </NuxtLink>
          </div>
        </div>

        <div v-if="item.intro?.length" :class="$style.intro">
          <p v-for="(paragraph, index) in item.intro" :key="index">
            {{ paragraph }}
          </p>
        </div>

        <section
          v-for="(section, index) in item.sections"
          :key="index"
          :class="$style.section"
        >
          <h2 v-if="section.heading" :class="$style.sectionTitle">
            {{ section.heading }}
          </h2>

          <ul v-if="section.list?.length" :class="$style.list">
            <li v-for="(listItem, listIndex) in section.list" :key="listIndex">
              {{ listItem }}
            </li>
          </ul>

          <div v-if="section.paragraphs?.length" :class="$style.paragraphs">
            <p v-for="(paragraph, paragraphIndex) in section.paragraphs" :key="paragraphIndex">
              {{ paragraph }}
            </p>
          </div>

          <blockquote v-if="section.quote" :class="$style.quote">
            {{ section.quote }}
          </blockquote>
        </section>

        <button type="button" :class="$style.share" @click="sharePage">
          <UIcon name="local:share" :class="$style.shareIcon" aria-hidden="true" />
          <span>Поделиться</span>
        </button>
      </div>

      <NewsDetailGallery
        :class="$style.gallery"
        :images="item.gallery ?? []"
        :alt="item.imageAlt || item.title"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  width: 100%;
}

.header {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-3);
  align-items: center;
}

.date {
  @include fs-text;
  color: var(--fs-color-gray);

  @include from-desktop {
    font-size: var(--fs-text-h4-size);
  }
}

.title {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
}

.layout {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);

  @include from-desktop {
    flex-direction: row;
    gap: var(--fs-space-3);
    align-items: flex-start;
    justify-content: space-between;
  }
}

.content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-5);
  min-width: 0;

  @include from-desktop {
    flex-basis: rem(768);
    max-width: rem(768);
  }
}

.gallery {
  flex: 1 1 auto;
  min-width: 0;

  @include from-desktop {
    flex-basis: rem(768);
    max-width: rem(768);
  }
}

.tenant {
  display: inline-flex;
  gap: var(--fs-space-2);
  align-items: center;
  width: fit-content;
  max-width: 100%;
  padding: var(--fs-space-2) var(--fs-space-3) var(--fs-space-2) var(--fs-space-2);
  background-color: var(--fs-color-light);
  border-radius: rem(32);
}

.tenantLogo {
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

.tenantLogoImage {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.tenantLogoFallback {
  width: rem(56);
  opacity: 0.25;
}

.tenantInfo {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  align-items: flex-start;
}

.mapLink {
  display: inline-flex;
  gap: rem(8);
  align-items: center;
  @include fs-text-md;
  color: var(--fs-color-black);
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      color: var(--fs-color-gray);
    }
  }
}

.mapIcon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}

.intro,
.paragraphs {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);

  p {
    margin: 0;
    @include fs-text-lg;
    color: var(--fs-color-black);
  }
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
}

.sectionTitle {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
}

.list {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: rem(16);
    @include fs-text-lg;
    color: var(--fs-color-black);

    &::before {
      position: absolute;
      top: rem(8);
      left: 0;
      width: rem(8);
      height: rem(8);
      content: '';
      background-color: var(--fs-color-beige);
      border-radius: 50%;
    }
  }
}

.quote {
  position: relative;
  margin: 0;
  padding: var(--fs-space-4);
  overflow: clip;
  @include fs-text-md;
  color: var(--fs-color-black);
  background-color: var(--fs-color-light);
  border-radius: rem(32);
}

.share {
  display: inline-flex;
  gap: rem(8);
  align-items: center;
  width: fit-content;
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  background: transparent;
  cursor: pointer;
  appearance: none;

  @media (hover: hover) {
    &:hover {
      color: var(--fs-color-gray);
    }
  }
}

.shareIcon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}
</style>
