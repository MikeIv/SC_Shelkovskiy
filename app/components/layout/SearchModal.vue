<script setup lang="ts">
import { searchEmptyMessage, searchSite } from '~/data/searchIndex'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const titleId = useId()
const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')

const groups = computed(() => searchSite(query.value))
const isEmpty = computed(
  () => query.value.trim().length > 0 && groups.value.length === 0,
)

function close(): void {
  emit('close')
}

function clearQuery(): void {
  query.value = ''
  inputRef.value?.focus()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function lockScroll(lock: boolean): void {
  if (!import.meta.client) {
    return
  }

  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

function bindListeners(bind: boolean): void {
  if (!import.meta.client) {
    return
  }

  if (bind) {
    document.addEventListener('keydown', onKeydown)
    return
  }

  document.removeEventListener('keydown', onKeydown)
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!import.meta.client) {
      return
    }

    bindListeners(false)

    if (!isOpen) {
      lockScroll(false)
      query.value = ''
      return
    }

    lockScroll(true)
    bindListeners(true)
    await nextTick()
    inputRef.value?.focus()
  },
)

onBeforeUnmount(() => {
  bindListeners(false)
  lockScroll(false)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      :class="$style.root"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <h2 :id="titleId" :class="$style.srOnly">
        Поиск по сайту
      </h2>

      <div :class="$style.inner">
        <div :class="$style.toolbar">
          <div :class="$style.field">
            <UIcon name="local:search" :class="$style.fieldIcon" aria-hidden="true" />
            <input
              ref="inputRef"
              v-model="query"
              :class="$style.input"
              type="search"
              enterkeyhint="search"
              placeholder="Поиск"
              autocomplete="off"
              spellcheck="false"
              :aria-labelledby="titleId"
            >
            <button
              v-if="query"
              :class="$style.clear"
              type="button"
              aria-label="Очистить"
              @click="clearQuery"
            >
              <UIcon name="local:cross" :class="$style.clearIcon" aria-hidden="true" />
            </button>
          </div>

          <button
            :class="$style.close"
            type="button"
            aria-label="Закрыть поиск"
            @click="close"
          >
            <UIcon name="local:cross" :class="$style.closeIcon" aria-hidden="true" />
          </button>
        </div>

        <div :class="$style.body">
          <p v-if="isEmpty" :class="$style.empty">
            {{ searchEmptyMessage }}
          </p>

          <div v-else-if="groups.length" :class="$style.results">
            <section
              v-for="(group, index) in groups"
              :key="group.id"
              :class="$style.group"
              :aria-labelledby="`${titleId}-${group.id}`"
            >
              <h3 :id="`${titleId}-${group.id}`" :class="$style.groupTitle">
                {{ group.label }}
              </h3>

              <ul :class="$style.list">
                <li v-for="item in group.items" :key="item.id">
                  <NuxtLink
                    :class="$style.hit"
                    :to="item.to"
                    @click="close"
                  >
                    <span :class="$style.hitTitle">{{ item.title }}</span>
                    <span :class="$style.hitMeta">{{ item.meta }}</span>
                  </NuxtLink>
                </li>
              </ul>

              <hr
                v-if="index < groups.length - 1"
                :class="$style.divider"
              >
            </section>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: fixed;
  inset: 0;
  z-index: z('modal');
  display: flex;
  flex-direction: column;
  background-color: var(--fs-color-white);
}

.inner {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-height: 0;
  padding-block: var(--fs-space-3) var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: rem(48);
    padding-block: rem(35) var(--fs-space-6);
  }
}

.toolbar {
  display: flex;
  gap: var(--fs-space-2);
  align-items: center;
  min-width: 0;

  @include from-desktop {
    gap: rem(24);
  }
}

.field {
  display: flex;
  flex: 1 1 auto;
  gap: var(--fs-space-1);
  align-items: center;
  min-width: 0;
  padding: rem(12) rem(20);
  border-radius: rem(100);
  color: var(--fs-color-black);
  background-color: var(--fs-color-light);

  @include from-desktop {
    padding: var(--fs-space-2) var(--fs-space-3);
  }

  &:focus-within {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.fieldIcon {
  flex-shrink: 0;
  width: rem(20);
  height: rem(20);

  @include from-desktop {
    width: rem(24);
    height: rem(24);
  }
}

.input {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-lg;
  font-weight: 700;
  color: var(--fs-color-black);
  background-color: transparent;
  outline: none;
  appearance: none;

  &::placeholder {
    font-weight: 400;
    color: var(--fs-color-black);
    opacity: 1;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button {
    appearance: none;
  }
}

.clear {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(24);
  height: rem(24);
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.clearIcon {
  display: block;
  width: rem(16);
  height: rem(16);
}

.close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: rem(44);
  height: rem(44);
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--fs-color-black);
  background-color: transparent;
  cursor: pointer;
  appearance: none;

  @include from-desktop {
    width: rem(24);
    height: rem(24);
  }

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}

.closeIcon {
  display: block;
  width: rem(24);
  height: rem(24);
}

.body {
  --scrollbar-thumb: var(--fs-color-beige);
  --scrollbar-track: transparent;

  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden auto;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);

  @supports not (scrollbar-color: auto) {
    &::-webkit-scrollbar {
      width: rem(4);
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: rem(100);
      background-color: var(--scrollbar-thumb);
    }

    &::-webkit-scrollbar-track {
      background-color: var(--scrollbar-track);
    }
  }
}

.empty {
  margin: 0;
  @include fs-h2;
  color: var(--fs-color-black);
}

.results {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  min-width: 0;

  @include from-desktop {
    gap: rem(32);
  }
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include from-desktop {
    gap: rem(24);
  }
}

.groupTitle {
  margin: 0;
  @include fs-h4;
  color: var(--fs-color-black);
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.hit {
  display: flex;
  flex-wrap: wrap;
  gap: rem(8) rem(24);
  align-items: baseline;
  min-width: 0;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (hover: hover) {
    &:hover .hitTitle {
      color: var(--fs-color-gray);
    }
  }
}

.hitTitle {
  @include fs-text-lg;
  min-width: 0;
  color: var(--fs-color-black);
  overflow-wrap: break-word;
  transition: color 0.2s ease;

  @include from-desktop {
    font-size: var(--fs-text-h4-size);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.hitMeta {
  flex-shrink: 0;
  @include fs-text-md;
  color: var(--fs-color-gray);
}

.divider {
  width: 100%;
  height: 0;
  margin: 0;
  border: 0;
  border-top: rem(1) solid var(--fs-color-light);
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
