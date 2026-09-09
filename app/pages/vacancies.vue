<script setup lang="ts">
import {
  vacanciesDefaultOpenId,
  vacanciesItems,
  vacanciesPageTitle,
} from '~/data/vacanciesPage'

const pageTitle = vacanciesPageTitle

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]
</script>

<template>
  <div :class="$style.root">
    <img
      :class="$style.watermark"
      src="/images/about/watermark.svg"
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

        <VacanciesList
          :items="vacanciesItems"
          :default-open-id="vacanciesDefaultOpenId"
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

.watermark {
  position: absolute;
  top: rem(-120);
  right: rem(-180);
  width: min(100%, rem(640));
  height: auto;
  pointer-events: none;
  opacity: 0.12;

  @include from-desktop {
    top: rem(-200);
    right: rem(-40);
    width: rem(980);
  }

  @include from-wide {
    width: rem(1348);
  }
}

.page {
  position: relative;
  z-index: z('default');
}
</style>
