import type { HomePageData } from '#shared/types/home'
import type { ApiEnvelope } from '#shared/types/api'
import { homeBrandRows } from '~/data/homeBrandItems'
import { homeGalleryItems } from '~/data/homeGalleryItems'
import { homeIntroSlides } from '~/data/homeIntroSlides'
import { homeNewsItems } from '~/data/homeNewsItems'
import { homeShopCategories } from '~/data/homeShopCategories'

/** Слайды, лента и галерея главной. Пустой раздел заменяется моком этого раздела. */
export function useHome() {
  const result = useApiData<ApiEnvelope<HomePageData>>('/api/home', () => ({
    data: withMocks(),
  }))

  const data = computed(() => withMocks(result.data.value.data))

  return {
    data,
    isFallback: computed(() => {
      if (result.isFallback.value) return true
      return (result.data.value.data.slides?.length ?? 0) === 0
    }),
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}

function withMocks(payload?: Partial<HomePageData>): HomePageData {
  return {
    slides: orMock(payload?.slides, homeIntroSlides),
    feed: orMock(payload?.feed, homeNewsItems),
    brands: orMock(payload?.brands, homeBrandRows),
    categories: orMock(payload?.categories, homeShopCategories),
    gallery: orMock(payload?.gallery, homeGalleryItems),
    videoUrl: payload?.videoUrl ?? null,
  }
}

function orMock<T>(items: T[] | undefined, mock: T[]): T[] {
  return items && items.length > 0 ? items : mock
}
