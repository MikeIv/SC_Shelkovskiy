<script setup lang="ts">
definePageMeta({
  headerOverlay: true,
})

const pageTitle = 'Социальная ответственность'

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
    <ResponsibilityHero
      :title="pageTitle"
      image-src="/images/responsibility/hero.jpg"
      image-alt="Белый котёнок с голубыми глазами на руках у человека"
      :breadcrumbs="breadcrumbItems"
    />
    <ResponsibilityPrinciples />
  </div>
</template>

<style module lang="scss">
.page {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-section);
}
</style>
