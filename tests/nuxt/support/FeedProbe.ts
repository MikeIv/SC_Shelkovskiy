import { defineComponent, h, ref } from 'vue'
import type { NewsFilterTab } from '#shared/types/news'
import { newsRelatedKind } from '#shared/utils/newsTag'

/** Пробник `useFeed`: вкладка, карточки и догрузка следующей страницы по клику. */
export const FeedProbe = defineComponent({
  props: {
    tab: { type: String, default: 'news' },
    /** Вкладка для кнопки переключения: нужна, чтобы поймать гонку «догрузка + смена вкладки». */
    switchTo: { type: String, default: 'news' },
  },
  async setup(props) {
    clearNuxtData()
    const tab = ref<NewsFilterTab>(props.tab as NewsFilterTab)
    const { items, hasMore, isFallback, loadMore } = await useFeed(tab)

    return () =>
      h(
        'div',
        {
          'data-count': String(items.value.length),
          'data-first': items.value[0]?.title ?? '',
          'data-last': items.value.at(-1)?.title ?? '',
          'data-more': String(hasMore.value),
          'data-fallback': String(isFallback.value),
          onClick: () => {
            void loadMore()
          },
        },
        [
          h(
            'button',
            {
              type: 'button',
              onClick: (event: Event) => {
                event.stopPropagation()
                tab.value = props.switchTo as NewsFilterTab
              },
            },
            'switch',
          ),
        ],
      )
  },
})

/** Пробник `useFeedItem`: детальная ленты и связанные записи. */
export const FeedItemProbe = defineComponent({
  props: {
    slug: { type: String, required: true },
  },
  async setup(props) {
    clearNuxtData()
    const { item, related } = await useFeedItem(props.slug)

    return () =>
      h('div', {
        'data-title': item.value?.title ?? '',
        'data-body': item.value?.bodyHtml ?? '',
        'data-period': item.value?.period ?? '',
        'data-related': String(related.value.length),
        'data-kind': item.value ? newsRelatedKind(item.value.tagVariant) : '',
      })
  },
})
