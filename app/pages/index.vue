<script setup lang="ts">
import { homeBrandRows } from '~/data/homeBrandItems'
import { homeCinemaItems } from '~/data/homeCinemaItems'
import { homeGalleryItems } from '~/data/homeGalleryItems'
import { homeIntroSlides } from '~/data/homeIntroSlides'
import { homeLoyaltyItems } from '~/data/homeLoyaltyItems'
import { homeNewsItems } from '~/data/homeNewsItems'
import { homeShopCategories } from '~/data/homeShopCategories'

definePageMeta({
  headerOverlay: true,
})

const pageTitle = 'ТРЦ «Щёлковский»'
const pageDescription =
  'Торгово-развлекательный центр «Щёлковский» в Москве: магазины, кинотеатр, рестораны, новости и акции.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: '/' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ShoppingCenter',
        name: pageTitle,
        description: pageDescription,
        url: 'https://schelkovsky-trc.ru',
        telephone: '+7-499-677-44-44',
        email: 'info@schelkovsky-trc.ru',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Щёлковское шоссе, 75',
          addressLocality: 'Москва',
          postalCode: '107207',
          addressCountry: 'RU',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
            opens: '10:00',
            closes: '22:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Friday', 'Saturday'],
            opens: '10:00',
            closes: '23:00',
          },
        ],
        sameAs: [
          'https://vk.com/trc.schelkovsky',
          'https://t.me/schelkovsky',
        ],
      }),
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
