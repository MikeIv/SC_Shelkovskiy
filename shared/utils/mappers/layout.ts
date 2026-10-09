import type { ContactsDepartment } from '#shared/types/contacts'
import type { LayoutResponseDto } from '#shared/types/dto/layout'
import type {
  LayoutAppLink,
  LayoutCtaMax,
  LayoutData,
  LayoutDayHours,
  LayoutHourException,
  LayoutHoursRange,
  LayoutHoursTenant,
  LayoutSocial,
} from '#shared/types/layout'
import { resolveAlt } from '#shared/utils/resolveAlt'

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const

const TIME = /^\d{2}:\d{2}$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Локальные глифы есть не у всех сетей стенда (Дзен, MAX).
 * Известные имена оставляем на `local:*`, чтобы hover в вёрстке не сломался.
 */
const KNOWN_SOCIALS: Record<string, Pick<LayoutSocial, 'icon' | 'hoverColor'>> = {
  вконтакте: { icon: 'local:social-vk', hoverColor: '#0077ff' },
  vk: { icon: 'local:social-vk', hoverColor: '#0077ff' },
  telegram: { icon: 'local:social-telegram', hoverColor: '#2aabee' },
  rutube: { icon: 'local:social-rutube', hoverColor: 'var(--fs-color-coral)' },
  сайт: { icon: 'local:social-globe', hoverColor: 'var(--fs-color-beige)' },
}

const APP_LINKS = [
  { id: 'app-store', field: 'app_store', label: 'App Store' },
  { id: 'google-play', field: 'google_play', label: 'Google Play' },
  { id: 'rustore', field: 'rustore', label: 'RuStore' },
] as const

/**
 * Стенд не описывает элементы недели. Берём `day` 1…7 из текста ручки
 * и пару `HH:MM`. Имена пары в спеке нет — принимаем open/close, from/to, start/end.
 * Чужой объект пропускается, и UI остаётся на моке.
 */
const TIME_PAIRS = [
  ['open', 'close'],
  ['from', 'to'],
  ['start', 'end'],
] as const

export function mapLayout(dto: LayoutResponseDto): LayoutData {
  const { contacts, hours, socials, apps, cta_max: ctaMax } = dto.data

  return {
    contacts: {
      address: text(contacts.address),
      metro: text(contacts.metro),
      phone: text(contacts.phone),
      phoneHref: phoneHref(text(contacts.phone)),
      email: text(contacts.email),
      emailHref: emailHref(text(contacts.email)),
      departments: contacts.departments.flatMap((item, index) => {
        const mapped = mapDepartment(item, index)
        return mapped ? [mapped] : []
      }),
    },
    hours: {
      timezone: text(hours.timezone),
      week: mapWeek(hours.week),
      exceptions: hours.exceptions.flatMap((item) => {
        const mapped = mapException(item)
        return mapped ? [mapped] : []
      }),
      tenants: hours.tenants.flatMap((item) => {
        const mapped = mapTenant(item)
        return mapped ? [mapped] : []
      }),
    },
    socials: socials.flatMap((item) => {
      const mapped = mapSocial(item)
      return mapped ? [mapped] : []
    }),
    apps: APP_LINKS.flatMap((app) => {
      const href = httpUrl(apps[app.field])
      if (!href) return []

      const link: LayoutAppLink = { id: app.id, label: app.label, href }
      return [link]
    }),
    ctaMax: mapCta(ctaMax),
  }
}

function mapWeek(items: unknown[]): LayoutDayHours[] {
  const byIndex = new Map<number, LayoutDayHours>()

  for (const item of items) {
    const record = asRecord(item)
    if (!record) continue

    const day = dayNumber(record.day)
    const times = timePair(record)
    if (!day || !times) continue

    byIndex.set(day - 1, {
      index: day - 1,
      label: DAY_LABELS[day - 1] ?? '',
      open: times.open,
      close: times.close,
    })
  }

  return [...byIndex.values()].sort((a, b) => a.index - b.index)
}

function mapException(item: unknown): LayoutHourException | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const date = text(record.date)
  if (!ISO_DATE.test(date)) return undefined

  const times = timePair(record)
  const closed = record.closed === true || record.is_closed === true
  if (!times && !closed) return undefined

  return {
    date,
    open: times?.open ?? '',
    close: times?.close ?? '',
    closed: closed && !times,
  }
}

function mapTenant(item: unknown): LayoutHoursTenant | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const name = text(record.name) || text(record.title)
  if (!name) return undefined

  const rawRanges = arrayField(record, ['ranges', 'hours', 'week'])
  const ranges = rawRanges.flatMap((range) => {
    const mapped = mapTenantRange(range)
    return mapped ? [mapped] : []
  })

  if (!ranges.length) return undefined

  return { name, ranges }
}

function mapTenantRange(item: unknown): LayoutHoursRange | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const times = timePair(record)
  if (!times) return undefined

  const day = dayNumber(record.day)
  const label = text(record.label) || text(record.days) || (day ? DAY_LABELS[day - 1] : '')
  if (!label) return undefined

  return { label, open: times.open, close: times.close }
}

function mapDepartment(item: unknown, index: number): ContactsDepartment | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const title = text(record.title) || text(record.name)
  if (!title) return undefined

  const phone = text(record.phone)
  const email = text(record.email)
  const ext = text(record.phone_ext) || text(record.ext) || text(record.extension)

  return {
    id: text(record.id) || `department-${index}`,
    title,
    phone,
    phoneHref: phoneHref(phone),
    phoneExt: formatExt(ext),
    email,
    emailHref: emailHref(email),
  }
}

function mapSocial(item: unknown): LayoutSocial | undefined {
  const record = asRecord(item)
  if (!record) return undefined

  const label = text(record.name) || text(record.title)
  const href = httpUrl(record.url) || httpUrl(record.href)
  if (!label || !href) return undefined

  const known = KNOWN_SOCIALS[label.toLowerCase().replaceAll('ё', 'е')]
  const iconSrc = iconUrl(record.icon)

  if (!known && !iconSrc) return undefined

  return {
    label,
    href,
    icon: known?.icon ?? null,
    iconSrc: known ? null : iconSrc,
    ...(known?.hoverColor ? { hoverColor: known.hoverColor } : {}),
  }
}

function mapCta(cta: LayoutResponseDto['data']['cta_max']): LayoutCtaMax | null {
  const url = httpUrl(cta.url)
  const title = text(cta.title)
  const description = text(cta.description)
  const imageSrc = iconUrl(cta.image)

  if (!url && !title && !description && !imageSrc) return null

  return {
    url,
    title,
    description,
    imageSrc,
    imageAlt: resolveAlt(title),
  }
}

function timePair(record: Record<string, unknown>): { open: string; close: string } | undefined {
  for (const [openKey, closeKey] of TIME_PAIRS) {
    const open = text(record[openKey])
    const close = text(record[closeKey])
    if (TIME.test(open) && TIME.test(close)) return { open, close }
  }

  return undefined
}

function dayNumber(value: unknown): number | undefined {
  const day = typeof value === 'number' ? value : Number(text(value))
  if (!Number.isInteger(day) || day < 1 || day > 7) return undefined
  return day
}

function arrayField(record: Record<string, unknown>, keys: readonly string[]): unknown[] {
  for (const key of keys) {
    const value = record[key]
    if (Array.isArray(value)) return value
  }

  return []
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function phoneHref(phone: string): string {
  const compact = phone.replace(/[^\d+]/g, '')
  return compact ? `tel:${compact}` : ''
}

function emailHref(email: string): string {
  return email ? `mailto:${email}` : ''
}

function formatExt(ext: string): string {
  if (!ext) return ''
  if (ext.startsWith('(')) return ext
  return `(${ext})`
}

function httpUrl(value: unknown): string {
  const raw = text(value)
  if (!raw) return ''

  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
    return raw
  } catch {
    return ''
  }
}

function iconUrl(value: unknown): string {
  const raw = text(value)
  if (!raw) return ''
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw
  return httpUrl(raw)
}
