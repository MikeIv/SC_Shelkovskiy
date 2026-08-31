<script setup lang="ts">
/**
 * Карточка арендатора каталога (Figma: card catalog, node 3032:34727).
 *
 * Наполнение (layout `card`):
 * 1. Логотип — при отсутствии `imageSrc` показывается заглушка.
 * 2. Теги — опционально, не более трёх (`loyalty` | `action` | `lunch`).
 * 3. Категория — mob: до 2 строк (3038:34784), tablet/desk: 1 строка (3038:34865, 3032:34727).
 * 4. Название бренда — mob: до 2 строк, tablet/desk: 1 строка.
 * 5. Этаж и кнопка перехода на схему.
 *
 * Поведение:
 * - клик по основной области карточки (`to`) → страница описания бренда;
 * - клик по иконке схемы → `mapUrl` или заглушка `/map` (арендатор подсветится позже).
 *
 * Вариант `list` — текстовое представление для спискового режима каталога.
 */
import { NuxtLink } from '#components'
import type { CatalogCardLayout, CatalogCardTag } from '#shared/types/catalog'

const SCHEME_STUB_PATH = '/map'

const tagIconMap: Record<CatalogCardTag, string> = {
  loyalty: 'local:gift',
  action: 'local:percent',
  lunch: 'local:fork-knife-spoon',
}

const props = withDefaults(
  defineProps<{
    layout?: CatalogCardLayout
    imageSrc?: string
    imageAlt?: string
    category: string
    title: string
    floor: string
    tags?: CatalogCardTag[]
    to?: string
    mapUrl?: string
    tenantId?: string
  }>(),
  {
    layout: 'card',
    imageSrc: '',
    imageAlt: '',
    tags: () => [],
    to: undefined,
    mapUrl: undefined,
    tenantId: undefined,
  },
)

const emit = defineEmits<{
  'map-click': []
}>()

const visibleTags = computed(() => props.tags.slice(0, 3))

const listRootTag = computed(() => (props.to ? NuxtLink : 'article'))
const listRootBind = computed(() => (props.to ? { to: props.to } : {}))

const cardMainTag = computed(() => (props.to ? NuxtLink : 'div'))
const cardMainBind = computed(() => (props.to ? { to: props.to } : {}))

const schemeTarget = computed(() => {
  if (props.mapUrl) {
    return props.mapUrl
  }

  if (props.tenantId) {
    return `${SCHEME_STUB_PATH}?tenant=${encodeURIComponent(props.tenantId)}`
  }

  return SCHEME_STUB_PATH
})

async function onMapClick(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  emit('map-click')

  const target = schemeTarget.value

  if (/^https?:\/\//.test(target)) {
    window.open(target, '_blank', 'noopener,noreferrer')
    return
  }

  await navigateTo(target)
}
</script>

<template>
  <article v-if="layout === 'card'" :class="$style.root" :data-layout="layout">
    <div :class="$style.card">
      <component :is="cardMainTag" :class="$style.main" v-bind="cardMainBind">
        <div :class="$style.media">
          <img
            v-if="imageSrc"
            :class="$style.logo"
            :src="imageSrc"
            :alt="imageAlt || title"
            loading="lazy"
            decoding="async"
          >
          <div v-else :class="$style.logoPlaceholder" aria-hidden="true">
            <UiLogo :class="$style.logoFallback" />
          </div>
        </div>

        <div :class="$style.head">
          <ul v-if="visibleTags.length" :class="$style.tags" aria-label="Метки">
            <li v-for="tag in visibleTags" :key="tag">
              <UiTag :variant="tag" :icon="tagIconMap[tag]" />
            </li>
          </ul>

          <div :class="$style.copy">
            <p :class="$style.category">{{ category }}</p>
            <h3 :class="$style.title">{{ title }}</h3>
          </div>
        </div>
      </component>

      <div :class="$style.footer">
        <p :class="$style.floor">{{ floor }}</p>

        <button
          type="button"
          :class="$style.mapButton"
          :aria-label="`Показать на схеме: ${title}, ${floor}`"
          @click="onMapClick"
        >
          <UIcon name="local:map" :class="$style.mapIcon" aria-hidden="true" />
        </button>
      </div>
    </div>
  </article>

  <component
    :is="listRootTag"
    v-else
    :class="$style.root"
    :data-layout="layout"
    v-bind="listRootBind"
  >
    <p :class="$style.category">{{ category }}</p>
    <h3 :class="$style.title">{{ title }}</h3>
    <p :class="$style.floor">{{ floor }}</p>
  </component>
</template>

<style module lang="scss">
@use 'tools' as *;

@mixin catalog-card-clamp($mobile-lines) {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $mobile-lines;

  @include from-tablet {
    -webkit-line-clamp: 1;
  }
}

.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: inherit;
  text-decoration: none;

  &[data-layout='list'] {
    gap: var(--fs-space-1);
    max-width: rem(372);

    .category,
    .title,
    .floor {
      @include catalog-card-clamp(1);
    }

    @media (hover: hover) {
      &:hover .title {
        color: var(--fs-color-beige);
      }
    }
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  width: 100%;
  padding: rem(12);
  border: rem(2) solid var(--fs-color-light);
  border-radius: rem(24);
  background-color: var(--fs-color-white);
  transition: border-color 0.2s ease;

  @include from-desktop {
    gap: var(--fs-space-2);
    padding: var(--fs-space-2);
    border-radius: rem(32);
  }

  @media (hover: hover) {
    .root:hover & {
      border-color: var(--fs-color-beige);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.main {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  min-width: 0;
  color: inherit;
  text-decoration: none;

  @include from-desktop {
    gap: var(--fs-space-1);
  }
}

.media {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: rem(140);
  overflow: clip;
  border-radius: rem(32);
  background-color: var(--fs-color-white);

  @include from-tablet {
    height: rem(174);
  }

  @include from-desktop {
    height: rem(290);
  }
}

.logo {
  display: block;
  width: rem(116);
  height: rem(120);
  object-fit: contain;
  object-position: center;

  @include from-tablet {
    width: rem(152);
    height: rem(158);
  }

  @include from-desktop {
    width: rem(218);
    height: rem(224);
  }
}

.logoPlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--fs-color-light);
}

.logoFallback {
  width: rem(120);
  opacity: 0.25;

  @include from-desktop {
    width: rem(160);
  }
}

.head {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  min-width: 0;
  padding: 0 rem(8);

  @include from-desktop {
    gap: var(--fs-space-1);
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.copy {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  min-width: 0;

  @include from-desktop {
    gap: var(--fs-space-1);
  }
}

.category {
  margin: 0;
  @include fs-text-lg;
  @include catalog-card-clamp(2);
  color: var(--fs-color-gray);
}

.title {
  margin: 0;
  @include fs-h4;
  @include catalog-card-clamp(2);
  color: var(--fs-color-black);
  transition: color 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.footer {
  display: flex;
  gap: var(--fs-space-1);
  align-items: center;
  justify-content: space-between;
  padding: 0 rem(8) rem(8);
}

.floor {
  margin: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  white-space: nowrap;
}

.mapButton {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: rem(1000);
  color: var(--fs-color-black);
  background-color: var(--fs-color-beige);
  cursor: pointer;
  appearance: none;

  @include from-desktop {
    width: auto;
    height: auto;
    padding: var(--fs-space-2);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.mapIcon {
  flex-shrink: 0;
  width: rem(20);
  height: rem(20);

  @include from-desktop {
    width: rem(24);
    height: rem(24);
  }
}
</style>
