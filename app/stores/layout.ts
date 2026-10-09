import type { LayoutData } from '#shared/types/layout'
import { staticLayoutData } from '~/utils/staticLayout'

/** Глобальные контакты и часы. I/O нет: пишет только `useSiteLayout`. */
export const useLayoutStore = defineStore('layout', () => {
  const initial = staticLayoutData()

  const contacts = ref(initial.contacts)
  const hours = ref(initial.hours)
  const socials = ref(initial.socials)
  const apps = ref(initial.apps)
  const ctaMax = ref(initial.ctaMax)
  const loaded = ref(false)
  const isFallback = ref(true)

  function apply(data: LayoutData, fallback: boolean) {
    contacts.value = data.contacts
    hours.value = data.hours
    socials.value = data.socials
    apps.value = data.apps
    ctaMax.value = data.ctaMax
    loaded.value = true
    isFallback.value = fallback
  }

  return {
    contacts,
    hours,
    socials,
    apps,
    ctaMax,
    loaded,
    isFallback,
    apply,
  }
})
