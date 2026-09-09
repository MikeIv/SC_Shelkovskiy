export type TenantsStat = {
  id: string
  value: string
  label: string
}

export type TenantsAdvantage = {
  id: string
  title: string
  imageSrc: string
  imageAlt: string
  points: string[]
}

export type TenantsFormTab = 'lease' | 'ads'

export type TenantsTradeProfile = {
  id: string
  label: string
}
