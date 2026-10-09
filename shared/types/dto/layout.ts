/**
 * `GET /layout`. Схемы элементов `departments`, `hours.week`, `hours.exceptions`
 * и `hours.tenants` в OpenAPI не описаны (на стенде массивы пустые), поэтому
 * элементы — `unknown`: маппер берёт только распознанные объекты, остальное пропускает.
 */
export type LayoutResponseDto = {
  data: {
    contacts: {
      address: string | null
      metro: string | null
      phone: string | null
      email: string | null
      departments: unknown[]
    }
    hours: {
      timezone: string | null
      week: unknown[]
      exceptions: unknown[]
      tenants: unknown[]
    }
    socials: unknown[]
    apps: {
      app_store: string | null
      google_play: string | null
      rustore: string | null
    }
    cta_max: {
      url: string | null
      title: string | null
      description: string | null
      image: string | null
    }
  }
}
