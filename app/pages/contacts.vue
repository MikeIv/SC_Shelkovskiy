<script setup lang="ts">
import {
  contactsDepartments,
  contactsFeedback,
  contactsHours,
  contactsPage,
} from '~/data/contactsPage'

const pageTitle = contactsPage.title

const breadcrumbItems = [
  { label: 'Главная', to: '/' },
  { label: pageTitle },
]

useSeoMeta({
  title: pageTitle,
})
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbItems" />

    <ContactsContent
      :content="contactsPage"
      :hours="contactsHours"
      :departments="contactsDepartments"
      :feedback="contactsFeedback"
    />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.page {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  padding-block: var(--fs-space-4);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: var(--fs-space-5);
    padding-block: var(--fs-space-6);
  }
}
</style>
