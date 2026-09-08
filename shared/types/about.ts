export type AboutStat = {
  id: string
  value: string
  label: string
}

export type AboutFeatureStat = {
  value: string
  label: string
}

export type AboutFeature = {
  id: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  stats?: AboutFeatureStat[]
}
