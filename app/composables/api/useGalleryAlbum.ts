import type { ApiEnvelope } from '#shared/types/api'
import type { GalleryAlbum } from '#shared/types/gallery'
import type { HomeGalleryAlbum } from '#shared/types/home'

/**
 * Фото альбома для просмотрщика на главной.
 *
 * Ручка `/home` отдаёт у альбома только обложку, поэтому набор догружается по клику
 * императивно — как «показать ещё» в ленте. До ответа показываем обложку карточки,
 * поэтому кадр не пустует, а счётчик до догрузки скрыт.
 */
export function useGalleryAlbum() {
  const api = useApi()
  const photos = ref<string[]>([])
  const pending = ref(false)
  let requestedId: string | null = null

  async function loadPhotos(album: HomeGalleryAlbum): Promise<void> {
    const id = album.id
    const cover = album.photos ?? []

    requestedId = id
    photos.value = cover
    /**
     * Обложка уже покрывает альбом (мок или альбом с одним фото) — догружать нечего,
     * и счётчик не ждёт ответа.
     */
    pending.value = cover.length < album.photoCount

    if (!pending.value) return

    try {
      const response = await api<ApiEnvelope<GalleryAlbum>>(
        `/api/gallery/${encodeURIComponent(id)}`,
      )

      /** Альбом могли переключить, пока шёл запрос: чужой набор не подставляем. */
      if (requestedId !== id) return

      if (response.data.photos.length) {
        photos.value = response.data.photos
      }
    } catch {
      /* Сеть отвалилась — обложка уже показана, кадр не трогаем. */
    } finally {
      if (requestedId === id) pending.value = false
    }
  }

  return { photos, pending, loadPhotos }
}
