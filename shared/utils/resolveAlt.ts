/**
 * В админке нет поля `alt`. Берём подпись из `title` / `name`, иначе пустая строка
 * (картинка декоративная для скринридера).
 */
export function resolveAlt(label: string | null | undefined): string {
  return label?.trim() ?? ''
}
