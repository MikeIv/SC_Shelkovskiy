<script setup lang="ts">
import type { EventDetailItem } from '#shared/types/events'
import { eventsRegisterPopup } from '~/data/eventsDetails'

defineProps<{
  item: EventDetailItem
}>()

const isRegisterOpen = ref(false)

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
  <article :class="$style.root">
    <header :class="$style.header">
      <div :class="$style.meta">
        <UiTag variant="afisha">{{ item.tagLabel }}</UiTag>
        <time
          v-if="item.publishedAt"
          :class="$style.date"
          :datetime="item.publishedAt"
        >
          {{ item.publishedAt }}
        </time>
      </div>

      <h1 :class="$style.title">{{ item.title }}</h1>
    </header>

    <div :class="$style.layout">
      <div :class="$style.content">
        <div :class="$style.metaCard">
          <div :class="$style.metaFields">
            <div :class="$style.metaField">
              <p :class="$style.metaLabel">Когда</p>
              <p :class="$style.metaValue">{{ item.when }}</p>
            </div>

            <div
              v-if="item.location"
              :class="$style.metaField"
            >
              <p :class="$style.metaLabel">Где</p>
              <p :class="$style.metaValue">{{ item.location }}</p>
            </div>
          </div>

          <UiButton
            v-if="item.register"
            type="button"
            :class="$style.register"
            @click="isRegisterOpen = true"
          >
            Зарегистрироваться
          </UiButton>
        </div>

        <div
          v-if="item.paragraphs.length"
          :class="$style.paragraphs"
        >
          <p
            v-for="(paragraph, index) in item.paragraphs"
            :key="index"
          >
            {{ paragraph }}
          </p>
        </div>

        <section
          v-if="item.program?.length"
          :class="$style.program"
          aria-labelledby="event-program-title"
        >
          <h2
            id="event-program-title"
            :class="$style.programTitle"
          >
            Программа мероприятия
          </h2>

          <ol :class="$style.programList">
            <li
              v-for="(entry, index) in item.program"
              :key="index"
              :class="$style.programRow"
            >
              <p :class="$style.programTime">{{ entry.time }}</p>
              <p :class="$style.programName">{{ entry.title }}</p>
            </li>
          </ol>
        </section>

        <button
          type="button"
          :class="$style.share"
          @click="sharePage"
        >
          <UIcon
            name="local:share"
            :class="$style.shareIcon"
            aria-hidden="true"
          />
          <span>Поделиться</span>
        </button>
      </div>

      <div :class="$style.media">
        <img
          v-if="item.imageSrc"
          :class="$style.image"
          :src="item.imageSrc"
          :alt="item.imageAlt || item.title"
          width="768"
          height="512"
          decoding="async"
        >
        <div
          v-else
          :class="$style.placeholder"
          aria-hidden="true"
        >
          <UiLogo :class="$style.placeholderLogo" />
        </div>
      </div>
    </div>
  </article>

  <EventsRegisterModal
    v-if="item.register"
    :open="isRegisterOpen"
    :content="eventsRegisterPopup"
    @close="isRegisterOpen = false"
  />
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  width: 100%;

  @include from-desktop {
    gap: rem(56);
  }
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
}

.title {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
  overflow-wrap: break-word;
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
    gap: var(--fs-space-6);
  }
}

.metaCard {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;
  width: 100%;
  padding: var(--fs-space-3);
  overflow: clip;
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-tablet {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.metaFields {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);

  @include from-desktop {
    flex-direction: row;
    gap: rem(56);
    align-items: center;
  }
}

.metaField {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  align-items: flex-start;
}

.metaLabel {
  margin: 0;
  @include fs-h4;
  color: var(--fs-color-black);
}

.metaValue {
  margin: 0;
  @include fs-h3;
  color: var(--fs-color-black);
}

.register {
  flex-shrink: 0;
}

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

.program {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  width: 100%;
}

.programTitle {
  margin: 0;
  @include fs-h3;
  color: var(--fs-color-black);
}

.programList {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.programRow {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-1);
  padding-bottom: var(--fs-space-2);
  border-bottom: rem(2) solid var(--fs-color-light);

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  @include from-desktop {
    flex-direction: row;
    gap: var(--fs-space-2);
    align-items: center;
  }
}

.programTime {
  margin: 0;
  @include fs-h4;
  color: var(--fs-color-black);

  @include from-desktop {
    flex: 0 0 rem(240);
    width: rem(240);
  }
}

.programName {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-black);
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

.media {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  overflow: clip;
  border-radius: rem(32);

  @include from-desktop {
    position: sticky;
    top: var(--fs-space-4);
    flex-basis: rem(768);
    max-width: rem(768);
    border-radius: rem(60);
  }
}

.image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 768 / 512;
  object-fit: cover;
  object-position: center;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 768 / 512;
  background-color: var(--fs-color-light);
}

.placeholderLogo {
  width: rem(120);
  opacity: 0.25;

  @include from-desktop {
    width: rem(160);
  }
}
</style>
