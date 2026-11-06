import type { AfishaWidgetManager } from '#shared/types/afishaWidget'

/** Скрипт SDK виджета Афиши: после загрузки даёт глобальный `window.widgetManager`. */
const WIDGET_SCRIPT_SRC = 'https://afisha.ru/w/afishaWidgetManager.global.js'

/** Экран расписания фильма: сеансы и переход к покупке (`ROUTES.creation` в SDK). */
const WIDGET_ROUTE = 'creation'

/** Окно после загрузки SDK: объект появляется, только когда скрипт отработал. */
type AfishaWidgetWindow = Window & { widgetManager?: AfishaWidgetManager }

/** Один скрипт на страницу: повторный клик не добавляет второй `<script>`. */
let scriptPromise: Promise<void> | null = null

export type AfishaTicketParams = {
  /** id произведения Афиши. */
  creationId: string
  /** id города и площадки — показывают в виджете сеансы кинотеатра ТРЦ. */
  cityId?: string | null
  placeId?: string | null
}

/**
 * Виджет покупки билетов Афиши. SDK грузится по первому клику: сторонний скрипт в `head`
 * главной не нужен, пока пользователь не собрался покупать.
 *
 * `openTicket` возвращает `false`, если виджет не поднялся (ключ пуст, скрипт заблокирован
 * блокировщиком рекламы, вендор недоступен) — карточка тогда открывает ссылку Афиши.
 */
export function useAfishaWidget() {
  const config = useRuntimeConfig()
  const widgetKey = computed(() => config.public.afishaWidgetKey.trim())

  async function openTicket(params: AfishaTicketParams): Promise<boolean> {
    if (!import.meta.client || !widgetKey.value) return false

    try {
      await loadWidgetScript(widgetKey.value)

      const manager = (window as AfishaWidgetWindow).widgetManager
      if (!manager) return false

      /** `modal` SDK открывает сам и закрывает предыдущее окно, поэтому результат не нужен. */
      await manager.appendWidget(
        {
          route: WIDGET_ROUTE,
          embedType: 'modal',
          creationType: 'movie',
          creationId: params.creationId,
          ...(params.cityId ? { cityId: params.cityId } : {}),
          ...(params.placeId ? { placeId: params.placeId } : {}),
        },
        document.body,
      )

      return true
    } catch (error) {
      if (import.meta.dev) {
        console.error('[useAfishaWidget]', error)
      }

      return false
    }
  }

  return { openTicket }
}

/**
 * Загрузка SDK. Ошибку не запоминаем: со следующего клика пробуем снова — сеть могла
 * пропасть, а блокировщик пользователь мог отключить.
 */
function loadWidgetScript(widgetKey: string): Promise<void> {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')

    script.src = WIDGET_SCRIPT_SRC
    script.async = true
    script.setAttribute('widget-key', widgetKey)
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Afisha widget script failed')), {
      once: true,
    })

    document.head.append(script)
  }).catch((error: unknown) => {
    scriptPromise = null
    throw error
  })

  return scriptPromise
}
