import type { HomeBrandRow } from '#shared/types/home'

/** Временные данные до контракта API. */
export const homeBrandRows: HomeBrandRow[] = [
  {
    id: 'top',
    direction: 'rtl',
    items: [
      {
        id: 'zolotoy',
        name: '585*Золотой',
        imageSrc: '/images/home/brands/zolotoy.png',
        imageAlt: '',
        shape: 'squircle',
      },
      {
        id: 'acoola',
        name: 'Acoola',
        imageSrc: '/images/home/brands/acoola.png',
        imageAlt: '',
        shape: 'circle',
        imageCrop: 'wide',
      },
      {
        id: 'adamas',
        name: 'ADAMAS',
        imageSrc: '/images/home/brands/adamas.png',
        imageAlt: '',
        shape: 'squircle',
      },
      {
        id: 'arya-home',
        name: 'ARYA home',
        imageSrc: '/images/home/brands/arya-home.png',
        imageAlt: '',
        shape: 'circle',
      },
    ],
  },
  {
    id: 'bottom',
    direction: 'ltr',
    items: [
      {
        id: 'befree',
        name: 'Befree',
        imageSrc: '/images/home/brands/befree.png',
        imageAlt: '',
        shape: 'circle',
      },
      {
        id: 'cozy-home',
        name: 'COZY HOME',
        imageSrc: '/images/home/brands/cozy-home.png',
        imageAlt: '',
        shape: 'squircle',
      },
      {
        id: 'colins',
        name: 'COLIN’S',
        imageSrc: '/images/home/brands/colins.png',
        imageAlt: '',
        shape: 'circle',
      },
      {
        id: 'ekonika',
        name: 'EKONIKA',
        imageSrc: '/images/home/brands/ekonika.png',
        imageAlt: '',
        shape: 'squircle',
        imageCrop: 'ekonika',
      },
      {
        id: 'gloria-jeans',
        name: 'Gloria Jeans',
        imageSrc: '/images/home/brands/gloria-jeans.png',
        imageAlt: '',
        shape: 'circle',
      },
    ],
  },
]
