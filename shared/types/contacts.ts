export type ContactsHoursRange = {
  id: string
  days: string
  time: string
}

export type ContactsDepartment = {
  id: string
  title: string
  phone: string
  phoneHref: string
  phoneExt: string
  email: string
  emailHref: string
}

export type ContactsPageContent = {
  title: string
  address: string
  metroLabel: string
  metroIconSrc: string
  phone: string
  phoneHref: string
  email: string
  emailHref: string
  mapSrc: string
  mapAlt: string
  helpTitle: string
  helpText: string
  helpCtaLabel: string
}

export type ContactsFeedbackTopic = {
  value: string
  label: string
}

export type ContactsFeedbackContent = {
  title: string
  description: string
  topics: readonly ContactsFeedbackTopic[]
  patternSrc: string
}
