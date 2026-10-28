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
  <ResponsibilityHero
    :title="pageTitle"
    image-src="/images/responsibility/hero.jpg"
    image-alt="Белый котёнок с голубыми глазами на руках у человека"
    :breadcrumbs="breadcrumbItems"
  />
</template>
