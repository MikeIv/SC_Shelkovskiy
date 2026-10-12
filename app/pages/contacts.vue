<script setup lang="ts">
import {
  contactsFeedback,
  contactsPage,
} from '~/data/contactsPage'
import { groupWeekRanges } from '#shared/utils/groupWeekRanges'

const layout = useLayoutStore()

const content = computed(() => ({
  ...contactsPage,
  address: layout.contacts.address,
  metroLabel: layout.contacts.metro,
  phone: layout.contacts.phone,
  phoneHref: layout.contacts.phoneHref,
  email: layout.contacts.email,
  emailHref: layout.contacts.emailHref,
}))

const hours = computed(() => groupWeekRanges(layout.hours.week))

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
      :content="content"
      :hours="hours"
      :departments="layout.contacts.departments"
      :feedback="contactsFeedback"
    />
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.page {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-5);
  padding-top: var(--fs-space-3);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    padding-top: var(--fs-space-6);
  }
}
</style>
