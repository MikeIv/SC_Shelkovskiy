<script setup lang="ts">
import { siteDescription, siteName, siteOgImage, siteUrl } from '~/data/siteMeta'
import { homeBrandRows } from '~/data/homeBrandItems'
import { homeCinemaItems } from '~/data/homeCinemaItems'
import { homeGalleryItems } from '~/data/homeGalleryItems'
import { homeLoyaltyItems } from '~/data/homeLoyaltyItems'
import { homeNewsItems } from '~/data/homeNewsItems'
import { homeShopCategories } from '~/data/homeShopCategories'
import { footerContacts } from '~/utils/siteFooter'

definePageMeta({
  headerOverlay: true,
})

const layout = useLayoutStore()
const { data: homeIntro } = await useHome()

/** Корневой URL площадки (rutube.ru/) — не профиль центра, в sameAs не публикуем. */
function hasSocialProfilePath(href: string): boolean {
  try {
    const { pathname } = new URL(href)
    return pathname !== '/' && pathname !== ''
  }
  catch {
    return false
  }
}

const schemaDayByLabel: Record<string, string> = {
  Пн: 'Monday',
  Вт: 'Tuesday',
  Ср: 'Wednesday',
  Чт: 'Thursday',
  Пт: 'Friday',
  Сб: 'Saturday',
  Вс: 'Sunday',
}

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ShoppingCenter',
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  telephone: layout.contacts.phone,
  email: layout.contacts.email,
  address: layout.contacts.address === footerContacts.address
    ? {
        '@type': 'PostalAddress',
        streetAddress: 'Щёлковское шоссе, 75',
        addressLocality: 'Москва',
        postalCode: '107207',
        addressCountry: 'RU',
      }
    : {
        '@type': 'PostalAddress',
        streetAddress: layout.contacts.address,
        addressCountry: 'RU',
      },
  openingHoursSpecification: layout.hours.week.map((day) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: schemaDayByLabel[day.label] ?? day.label,
    opens: day.open,
    closes: day.close,
  })),
  sameAs: layout.socials
    .filter((link) => link.label !== 'Сайт' && hasSocialProfilePath(link.href))
    .map((link) => link.href),
}))

useSeoMeta({
  title: siteName,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogType: 'website',
  ogUrl: siteUrl,
  ogImage: siteOgImage,
  twitterCard: 'summary_large_image',
  twitterImage: siteOgImage,
})

useHead(() => ({
  link: [{ rel: 'canonical', href: siteUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd.value),
    },
  ],
}))
</script>

<template>
  <div>
    <h1 :class="$style.hiddenTitle">{{ siteName }}</h1>
    <HomeIntro :slides="homeIntro.slides" />
    <div :class="$style.stack">
      <HomeNews :items="homeNewsItems" />
      <HomeBrands :rows="homeBrandRows" flush />
      <HomeLoyalty :items="homeLoyaltyItems" flush />
      <HomeShopCategories :items="homeShopCategories" />
      <HomeCinema :items="homeCinemaItems" />
      <HomeGallery :items="homeGalleryItems" />
    </div>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.stack {
  /* Секции через --fs-space-section; desk: padding-top героя 140. */
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-section);
  padding-top: var(--fs-space-section);

  @include from-desktop {
    padding-top: rem(140);
  }
}

/* Единственный h1 страницы: заголовки слайдов — h2, поэтому главная не остаётся без h1. */
.hiddenTitle {
  @include fs-visually-hidden;
}
</style>
