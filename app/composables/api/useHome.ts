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

  const data = computed<HomeIntroData>(() => result.data.value.data)

  return {
    data,
    isFallback: result.isFallback,
    error: result.error,
    pending: result.pending,
    refresh: result.refresh,
  }
}
