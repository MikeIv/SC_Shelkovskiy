<script setup lang="ts">
import { vacanciesPageTitle } from '~/data/vacanciesPage'

const { items } = await useVacancies()

const pageTitle = vacanciesPageTitle

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]

/** Текст пустого ответа держим в странице: ручка отдаёт только список. */
const labels = {
  empty: 'Вакансии пока не опубликованы.',
} as const
</script>

<template>
  <div :class="$style.root">
    <img
      :class="$style.pattern"
      src="/images/ornament/pattern.svg"
      alt=""
      width="1348"
      height="1344"
      aria-hidden="true"
      decoding="async"
    >

    <div :class="$style.page">
      <LayoutInnerPage :title="pageTitle">
        <template #lead>
          <UiBreadcrumbs :items="breadcrumbItems" />
        </template>

        <p
          v-if="!items.length"
          :class="$style.note"
        >
          {{ labels.empty }}
        </p>

        <VacanciesList
          v-else
          :items="items"
        />
      </LayoutInnerPage>
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  overflow: clip;
}

.pattern {
  position: absolute;
  top: 0;
  left: rem(-200);
  width: min(140%, rem(520));
  max-width: none;
  height: auto;
  pointer-events: none;

  @include from-tablet {
    left: rem(-333);
    width: rem(725);
  }

  @include from-desktop {
    top: calc(#{rem(-274)} - #{rem(151)});
    left: calc(66.67% - #{rem(34)});
    width: rem(1348);
  }
}

.page {
  position: relative;
  z-index: z('default');
}

.note {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}
</style>
