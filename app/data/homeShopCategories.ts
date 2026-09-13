import type { HomeShopCategory } from '#shared/types/home'

export const homeShopCategories: HomeShopCategory[] = [
  {
    id: 'women',
    title: 'Женская одежда',
    leftImageSrc: '/images/home/categories/women-left.jpg',
    leftImageAlt: 'Женская одежда — модель в платье',
    rightImageSrc: '/images/home/categories/women-right.jpg',
    rightImageAlt: 'Женская одежда — модель в белом костюме',
  },
  {
    id: 'men',
    title: 'Мужская одежда',
    leftImageSrc: '/images/home/categories/men-left.jpg',
    leftImageAlt: 'Мужская одежда — модель в пиджаке',
    rightImageSrc: '/images/home/categories/men-right.jpg',
    rightImageAlt: 'Мужская одежда — модель у моря',
  },
  {
    id: 'shoes',
    title: 'Обувь и сумки',
    leftImageSrc: '/images/home/categories/shoes-left.jpg',
    leftImageAlt: 'Обувь — кожаные туфли',
    rightImageSrc: '/images/home/categories/shoes-right.jpg',
    rightImageAlt: 'Сумка — кожаная модель полумесяц',
  },
  {
    id: 'home',
    title: 'Товары для дома',
    leftImageSrc: '/images/home/categories/home-left.jpg',
    leftImageAlt: 'Товары для дома — постельное бельё',
    rightImageSrc: '/images/home/categories/home-right.jpg',
    rightImageAlt: 'Товары для дома — стопки полотенец',
    leftImageCrop: 'wide',
  },
  {
    id: 'tech',
    title: 'Техника',
    leftImageSrc: '/images/home/categories/tech-left.jpg',
    leftImageAlt: 'Техника — электрогриль',
    rightImageSrc: '/images/home/categories/tech-right.jpg',
    rightImageAlt: 'Техника — смартфоны',
  },
]
