<script setup lang="ts">
import { siteDescription, siteName, siteOgImage, siteUrl } from '~/data/siteMeta'
import { homeLoyaltyItems } from '~/data/homeLoyaltyItems'
import { footerContacts } from '~/utils/siteFooter'

definePageMeta({
  headerOverlay: true,
})

const layout = useLayoutStore()
const { data: home, demo: homeDemo } = await useHome()
const {
  items: cinemaItems,
  cityId: cinemaCityId,
  placeId: cinemaPlaceId,
  isDemo: cinemaDemo,
} = useCinema()

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
    <HomeIntro :slides="home.slides" :is-demo="homeDemo.slides" />
    <div :class="$style.stack">
      <HomeNews :items="home.feed" :is-demo="homeDemo.feed" />
      <HomeBrands :rows="home.brands" :is-demo="homeDemo.brands" flush />
      <HomeLoyalty :items="homeLoyaltyItems" flush />
      <HomeShopCategories :items="home.categories" :is-demo="homeDemo.categories" />
      <HomeCinema
        :items="cinemaItems"
        :city-id="cinemaCityId"
        :place-id="cinemaPlaceId"
        :is-demo="cinemaDemo"
      />
      <HomeGallery :items="home.gallery" :is-demo="homeDemo.gallery" />
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
