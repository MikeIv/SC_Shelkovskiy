import type { HomePageData } from '#shared/types/home'
import type { ApiEnvelope } from '#shared/types/api'
import { homeBrandRows } from '~/data/homeBrandItems'
import { homeGalleryItems } from '~/data/homeGalleryItems'
import { homeIntroSlides } from '~/data/homeIntroSlides'
import { homeNewsItems } from '~/data/homeNewsItems'
import { homeShopCategories } from '~/data/homeShopCategories'

/** Разделы `/api/home`, которые могут подменяться моком по отдельности. */
export type HomeDemoSection = 'slides' | 'feed' | 'brands' | 'categories' | 'gallery'

export type HomeDemoFlags = Record<HomeDemoSection, boolean>

/** Слайды, лента и галерея главной. Пустой раздел заменяется моком этого раздела. */
export function useHome() {
  const result = useApiData<ApiEnvelope<HomePageData>>('/api/home', () => ({
    data: withMocks().data,
  }))

  const resolved = computed(() => withMocks(result.data.value.data, result.isFallback.value))
  const data = computed(() => resolved.value.data)
  const demo = computed(() => resolved.value.demo)

  return {
    data,
    /** Какие разделы сейчас из мока — для ярлыка в секции, не для глобальной плашки. */
    demo,
    /**
     * Сбой запроса или пустые слайды (пустой главной на стенде не бывает).
     * Частичный мок брендов/галереи сам по себе фолбэком страницы не считается.
     */
    isFallback: computed(() => result.isFallback.value || demo.value.slides),
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}

function withMocks(
  payload?: Partial<HomePageData>,
  forceAll = false,
): { data: HomePageData; demo: HomeDemoFlags } {
  const demo: HomeDemoFlags = {
    slides: forceAll || isEmpty(payload?.slides),
    feed: forceAll || isEmpty(payload?.feed),
    brands: forceAll || isEmpty(payload?.brands),
    categories: forceAll || isEmpty(payload?.categories),
    gallery: forceAll || isEmpty(payload?.gallery),
  }

  return {
    data: {
      slides: demo.slides ? homeIntroSlides : (payload!.slides as HomePageData['slides']),
      feed: demo.feed ? homeNewsItems : (payload!.feed as HomePageData['feed']),
      brands: demo.brands ? homeBrandRows : (payload!.brands as HomePageData['brands']),
      categories: demo.categories
        ? homeShopCategories
        : (payload!.categories as HomePageData['categories']),
      gallery: demo.gallery ? homeGalleryItems : (payload!.gallery as HomePageData['gallery']),
      videoUrl: payload?.videoUrl ?? null,
    },
    demo,
  }
}

function isEmpty<T>(items: T[] | undefined): boolean {
  return !items || items.length === 0
}
