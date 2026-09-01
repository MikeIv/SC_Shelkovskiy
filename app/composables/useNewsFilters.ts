import type { NewsCardItem, NewsFilterTab } from '#shared/types/news'

export function useNewsFilters(items: MaybeRefOrGetter<NewsCardItem[]>) {
  const tab = ref<NewsFilterTab>('news')
  const source = computed(() => toValue(items))

  const filteredItems = computed(() => {
    if (tab.value === 'news') {
      return source.value
    }

    if (tab.value === 'action') {
      return source.value.filter((item) => item.tagVariant === 'action')
    }

    return source.value.filter((item) => item.tagVariant === 'smi')
  })

  return {
    tab,
    filteredItems,
  }
}
