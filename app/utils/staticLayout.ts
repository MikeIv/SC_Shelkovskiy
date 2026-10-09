import { contactsDepartments, contactsPage } from '~/data/contactsPage'
import { eventsRegisterPopup } from '~/data/eventsDetails'
import { loyaltyStoreLinks } from '~/data/loyaltyPage'
import { mallHoursTenants, mallOpenHours } from '~/data/mallHours'
import type { LayoutData, LayoutSocial } from '#shared/types/layout'
import { footerContacts, footerSocialLinks } from '~/utils/siteFooter'

/** Мок layout: то, что уже нарисовано, пока стенд не заполнил поле. */
export function staticLayoutData(): LayoutData {
  return {
    contacts: {
      address: footerContacts.address,
      metro: contactsPage.metroLabel,
      phone: footerContacts.phone,
      phoneHref: footerContacts.phoneHref,
      email: footerContacts.email,
      emailHref: footerContacts.emailHref,
      departments: contactsDepartments.map((item) => ({ ...item })),
    },
    hours: {
      timezone: 'Europe/Moscow',
      week: mallOpenHours.map((day, index) => ({
        index,
        label: day.label,
        open: day.open,
        close: day.close,
      })),
      exceptions: [],
      tenants: mallHoursTenants.map((tenant) => ({
        name: tenant.name,
        ranges: tenant.ranges.map((range) => ({ ...range })),
      })),
    },
    socials: footerSocialLinks.map((item) => {
      const social: LayoutSocial = {
        label: item.label,
        href: item.href,
        icon: item.icon,
        iconSrc: null,
        ...(item.hoverColor ? { hoverColor: item.hoverColor } : {}),
      }
      return social
    }),
    apps: loyaltyStoreLinks.flatMap((item) => {
      if (item.id !== 'app-store' && item.id !== 'google-play' && item.id !== 'rustore') return []

      return [{ id: item.id, label: item.label, href: item.href }]
    }),
    ctaMax: {
      url: eventsRegisterPopup.ctaHref,
      title: eventsRegisterPopup.title,
      description: eventsRegisterPopup.description,
      imageSrc: eventsRegisterPopup.imageSrc,
      imageAlt: eventsRegisterPopup.imageAlt,
    },
  }
}
