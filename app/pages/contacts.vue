<script setup lang="ts">
import { groupWeekRanges } from '#shared/utils/groupWeekRanges'

const layout = useLayoutStore()
const { page } = await useContactsPage()

const content = computed(() => ({
  ...page.value.content,
  address: layout.contacts.address,
  metroLabel: layout.contacts.metro,
  phone: layout.contacts.phone,
  phoneHref: layout.contacts.phoneHref,
  email: layout.contacts.email,
  emailHref: layout.contacts.emailHref,
}))

const hours = computed(() => groupWeekRanges(layout.hours.week))

const breadcrumbItems = computed(() => [
  { label: 'Главная', to: '/' },
  { label: page.value.content.title },
])

useSeoMeta({
  title: () => page.value.seoTitle,
  description: () => page.value.seoDescription,
  ogImage: () => page.value.seoOgImage,
})
</script>

<template>
  <div :class="$style.page">
    <UiBreadcrumbs :items="breadcrumbItems" />

    <ContactsContent
      :content="content"
      :hours="hours"
      :departments="layout.contacts.departments"
      :feedback="page.feedback"
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
