<script setup lang="ts">
const { page, error, refresh } = await useRulesPage()

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: page.value.title },
])

/** Тексты состояний держим в компоненте: контент этой страницы приходит без них. */
const labels = {
  error: 'Не удалось загрузить документы.',
  empty: 'Документы пока не опубликованы.',
  retry: 'Обновить',
} as const

/** Повторный запрос из состояния ошибки: `useApiFetch` перезапишет `error` и `data`. */
async function retry() {
  await refresh()
}

useSeoMeta({
  description: () => page.value.seoDescription,
  ogImage: () => page.value.seoOgImage,
})

/**
 * `keywords` нет в `MetaFlat`/`UseSeoMetaInput` unhead 3, поэтому тег ставим через
 * `useHead`: ключ известен схеме (`MetaNames`), ограничение только в типах `useSeoMeta`.
 */
useHead(() => ({
  meta: page.value.seoKeywords
    ? [{ name: 'keywords', content: page.value.seoKeywords }]
    : [],
}))
</script>

<template>
  <LayoutInnerPage
    :title="page.title"
    :seo-title="page.seoTitle"
  >
    <template #lead>
      <UiBreadcrumbs :items="breadcrumbItems" />
    </template>

    <p
      v-if="error"
      :class="$style.note"
      role="alert"
    >
      {{ labels.error }}
      <button
        type="button"
        :class="$style.retry"
        @click="retry"
      >
        {{ labels.retry }}
      </button>
    </p>

    <p
      v-else-if="!page.documents.length"
      :class="$style.note"
    >
      {{ labels.empty }}
    </p>

    <RulesList
      v-else
      :items="page.documents"
    />
  </LayoutInnerPage>
</template>

<style module lang="scss">
@use 'tools' as *;

.note {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}

.retry {
  margin: 0;
  padding: 0;
  border: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: var(--fs-color-black);
  text-decoration: underline;
  background: none;
  cursor: pointer;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }
}
</style>
