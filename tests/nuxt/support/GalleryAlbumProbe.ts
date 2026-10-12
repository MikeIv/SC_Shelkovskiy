import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import type { HomeGalleryAlbum } from '#shared/types/home'

/**
 * Пробник `useGalleryAlbum`: набор после догрузки читается из атрибутов,
 * поэтому тест не зависит от разметки просмотрщика.
 */
export const GalleryAlbumProbe = defineComponent({
  props: {
    album: { type: Object as PropType<HomeGalleryAlbum>, required: true },
  },
  async setup(props) {
    const { photos, pending, loadPhotos } = useGalleryAlbum()

    await loadPhotos(props.album)

    return () =>
      h('div', {
        'data-count': String(photos.value.length),
        'data-photos': photos.value.join(','),
        'data-pending': String(pending.value),
      })
  },
})
