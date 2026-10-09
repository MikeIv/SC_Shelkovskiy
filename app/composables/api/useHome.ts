import type { HomeIntroSlide } from '#shared/types/home'
import type { ApiEnvelope } from '#shared/types/api'
import { homeIntroSlides } from '~/data/homeIntroSlides'

export type HomeIntroData = {
  slides: HomeIntroSlide[]
}

/** Слайды главной. Прокси отдаёт конверт, наружу — тот же UI-тип, что у мока. */
export function useHome() {
  const result = useApiData<ApiEnvelope<HomeIntroData>>('/api/home', () => ({
    data: { slides: homeIntroSlides },
  }))

  /** Пустой список — тоже отсутствие данных: главная не остаётся без intro. */
  const isEmpty = computed(() => result.data.value.data.slides.length === 0)
  const data = computed<HomeIntroData>(() =>
    isEmpty.value ? { slides: homeIntroSlides } : result.data.value.data,
  )

  return {
    data,
    isFallback: computed(() => result.isFallback.value || isEmpty.value),
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
