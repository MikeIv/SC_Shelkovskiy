<script setup lang="ts">
import { vacanciesItems, vacanciesPageTitle } from '~/data/vacanciesPage'

const pageTitle = vacanciesPageTitle

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]
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

        <VacanciesList :items="vacanciesItems" />
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
  height: auto;
  max-width: none;
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
</style>
