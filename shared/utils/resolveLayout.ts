import type { LayoutAppLink, LayoutCtaMax, LayoutData, LayoutDayHours } from '#shared/types/layout'

/**
 * Пустые куски ответа не затирают вёрстку: соцсети со стенда остаются,
 * а незаполненные контакты и неполная неделя берутся из мока.
 */
export function resolveLayoutView(api: LayoutData, fallback: LayoutData): LayoutData {
  return {
    contacts: {
      address: api.contacts.address || fallback.contacts.address,
      metro: api.contacts.metro || fallback.contacts.metro,
      phone: api.contacts.phone || fallback.contacts.phone,
      phoneHref: api.contacts.phoneHref || fallback.contacts.phoneHref,
      email: api.contacts.email || fallback.contacts.email,
      emailHref: api.contacts.emailHref || fallback.contacts.emailHref,
      departments: api.contacts.departments.length
        ? api.contacts.departments
        : fallback.contacts.departments,
    },
    hours: {
      timezone: api.hours.timezone || fallback.hours.timezone,
      week: isCompleteWeek(api.hours.week) ? api.hours.week : fallback.hours.week,
      exceptions: api.hours.exceptions,
      tenants: api.hours.tenants.length ? api.hours.tenants : fallback.hours.tenants,
    },
    socials: api.socials.length ? api.socials : fallback.socials,
    apps: mergeApps(api.apps, fallback.apps),
    ctaMax: mergeCta(api.ctaMax, fallback.ctaMax),
  }
}

function isCompleteWeek(week: readonly LayoutDayHours[]): boolean {
  if (week.length !== 7) return false

  const indexes = new Set(week.map((day) => day.index))
  return indexes.size === 7 && [...indexes].every((index) => index >= 0 && index <= 6)
}

/**
 * Ссылки на приложения мержим по `id`: незаполненное поле стенда (`app_store` = null)
 * оставляет кнопку на моке, а не убирает её со страницы.
 */
function mergeApps(
  api: readonly LayoutAppLink[],
  fallback: readonly LayoutAppLink[],
): LayoutAppLink[] {
  const fromApi = new Map(api.map((link) => [link.id, link]))
  const merged = fallback.map((link) => fromApi.get(link.id) ?? link)
  const mergedIds = new Set(merged.map((link) => link.id))

  for (const link of api) {
    if (!mergedIds.has(link.id)) merged.push(link)
  }

  return merged
}

function mergeCta(api: LayoutCtaMax | null, fallback: LayoutCtaMax | null): LayoutCtaMax | null {
  if (!api) return fallback
  if (!fallback) return api

  return {
    url: api.url || fallback.url,
    title: api.title || fallback.title,
    description: api.description || fallback.description,
    imageSrc: api.imageSrc || fallback.imageSrc,
    imageAlt: api.imageAlt || fallback.imageAlt,
  }
}
