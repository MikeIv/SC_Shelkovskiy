import type { RulesDocument } from '#shared/types/rules'

export const rulesPageTitle = 'Правила'

/** Временный список документов до контракта API (макет Figma 580:32995). */
export const rulesDocuments: readonly RulesDocument[] = [
  {
    id: 'visiting',
    title: 'Правила посещения ТРЦ «Щёлковский»',
    href: '#',
  },
  {
    id: 'parking',
    title: 'Правила парковки автомобилей на территории ТРЦ «Щёлковский»',
    href: '#',
  },
  {
    id: 'cloakroom',
    title: 'Правила пользования гардеробом',
    href: '#',
  },
]
