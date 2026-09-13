<script setup lang="ts">
import { mallOpenHours } from '~/data/mallHours'
import { siteDescription, siteName, siteUrl } from '~/data/siteMeta'
import { homeBrandRows } from '~/data/homeBrandItems'
import { homeCinemaItems } from '~/data/homeCinemaItems'
import { homeGalleryItems } from '~/data/homeGalleryItems'
import { homeIntroSlides } from '~/data/homeIntroSlides'
import { homeLoyaltyItems } from '~/data/homeLoyaltyItems'
import { homeNewsItems } from '~/data/homeNewsItems'
import { homeShopCategories } from '~/data/homeShopCategories'
import { footerContacts, footerSocialLinks } from '~/utils/siteFooter'

definePageMeta({
  headerOverlay: true,
})

const schemaDayByLabel: Record<(typeof mallOpenHours)[number]['label'], string> = {
  Пн: 'Monday',
  Вт: 'Tuesday',
  Ср: 'Wednesday',
  Чт: 'Thursday',
  Пт: 'Friday',
  Сб: 'Saturday',
  Вс: 'Sunday',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ShoppingCenter',
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  telephone: footerContacts.phone,
  email: footerContacts.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Щёлковское шоссе, 75',
    addressLocality: 'Москва',
    postalCode: '107207',
    addressCountry: 'RU',
  },
  openingHoursSpecification: mallOpenHours.map((day) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: schemaDayByLabel[day.label],
    opens: day.open,
    closes: day.close,
  })),
  sameAs: footerSocialLinks
    .filter((link) => link.label !== 'Сайт')
    .map((link) => link.href),
}

useSeoMeta({
  title: siteName,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogType: 'website',
  ogUrl: siteUrl,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd),
    },
  ],
})
</script>

<template>
  <div>
    <HomeIntro :slides="homeIntroSlides" />
    <HomeNews :items="homeNewsItems" />
    <HomeBrands :rows="homeBrandRows" />
    <HomeLoyalty :items="homeLoyaltyItems" />
    <HomeShopCategories :items="homeShopCategories" />
    <HomeCinema :items="homeCinemaItems" />
    <HomeGallery :items="homeGalleryItems" />
  </div>
</template>
