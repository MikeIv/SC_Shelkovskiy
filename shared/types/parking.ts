export type ParkingTariff = {
  id: string
  label: string
  price: string
}

export type ParkingFloor = {
  id: string
  label: string
}

export type ParkingPass = {
  id: string
  label: string
  price: string
  unit: string
  imageSrc: string
  imageAlt: string
}

export type ParkingRate = {
  label: string
  value: string
}

export type ParkingBenefitBlock = {
  id: string
  title: string
  rates: ParkingRate[]
  note: string
}

export type ParkingSpecialBlock = {
  id: string
  title: string
  description: string
  rates: ParkingRate[]
  notes: string[]
}
