/** `seo` из ответов API. Пустые строки — поля, которых не было в ответе. */
export type ApiSeo = {
  title: string
  description: string
  keywords: string
  ogImage: string
}
