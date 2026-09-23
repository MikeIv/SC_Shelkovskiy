export type ShareNetwork = 'max' | 'vk' | 'ok'

/** URL шаринга текущей страницы во внешнюю соцсеть. */
export function getShareNetworkUrl(network: ShareNetwork, pageUrl: string): string {
  const url = encodeURIComponent(pageUrl)

  switch (network) {
    case 'vk':
      return `https://vk.com/share.php?url=${url}`
    case 'ok':
      return `https://connect.ok.ru/offer?url=${url}`
    case 'max':
      return `https://max.ru/share?url=${url}`
  }
}
