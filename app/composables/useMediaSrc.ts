/**
 * Картинка через ipx: в `src` попадает `/_ipx/…`, а не прямой `/storage/…` стенда.
 */
export function useMediaSrc() {
  const img = useImage()

  return (source: string, width: number): string => {
    if (!source) return ''

    return img(source, { width, format: 'webp' }) || source
  }
}
