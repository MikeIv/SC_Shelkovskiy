import type {
  AfishaWidgetInstance,
  AfishaWidgetManager,
  AfishaWidgetParams,
} from '#shared/types/afishaWidget'

/** Скрипт SDK виджета Афиши: после загрузки даёт глобальный `window.widgetManager`. */
const WIDGET_SCRIPT_SRC = 'https://afisha.ru/w/afishaWidgetManager.global.js'

/** Экран расписания фильма: сеансы и переход к покупке (`ROUTES.creation` в SDK). */
const WIDGET_ROUTE = 'creation'

/** Экран расписания площадки: сеансы кинотеатра ТРЦ (`ROUTES.place`). */
const WIDGET_PLACE_ROUTE = 'place'

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
 * Виджет Афиши в трёх видах: модальное окно покупки по клику на карточку, модальное
 * расписание всей площадки и встроенное расписание для разделов без серверных данных.
 *
 * SDK грузится по требованию: сторонний скрипт в `head` главной не нужен, пока он не понадобился.
 */
export function useAfishaWidget() {
  const config = useRuntimeConfig()
  const widgetKey = computed(() => config.public.afishaWidgetKey.trim())
  const placeId = computed(() => config.public.afishaWidgetPlaceId.trim())

  /** Загружает SDK и отдаёт менеджер: `undefined`, если скрипт не поднялся. */
  async function getManager(): Promise<AfishaWidgetManager | undefined> {
    if (!import.meta.client || !widgetKey.value) return undefined

    try {
      await loadWidgetScript(widgetKey.value)

      return (window as AfishaWidgetWindow).widgetManager
    } catch (error) {
      logWidgetError(error)

      return undefined
    }
  }

  /** Модальное окно виджета: SDK открывает его сам и закрывает предыдущее. */
  async function openModal(params: AfishaWidgetParams): Promise<boolean> {
    const manager = await getManager()
    if (!manager) return false

    try {
      await manager.appendWidget(params, document.body)

      return true
    } catch (error) {
      logWidgetError(error)

      return false
    }
  }

  async function openTicket(params: AfishaTicketParams): Promise<boolean> {
    return openModal({
      route: WIDGET_ROUTE,
      embedType: 'modal',
      creationType: 'movie',
      creationId: params.creationId,
      ...(params.cityId ? { cityId: params.cityId } : {}),
      ...(params.placeId ? { placeId: params.placeId } : {}),
    })
  }

  /**
   * Вся афиша кинотеатра в модальном окне — кнопка «Смотреть все». `placeId` из данных ручки
   * важнее конфига: он приходит от Афиши вместе с фильмами.
   */
  async function openPlaceSchedule(placeIdOverride?: string | null): Promise<boolean> {
    const target = placeIdOverride?.trim() || placeId.value
    if (!target) return false

    return openModal({ route: WIDGET_PLACE_ROUTE, embedType: 'modal', placeId: target })
  }

  /**
   * Встроенное расписание кинотеатра — для разделов без серверных данных. Нужен только
   * `place-id`: экран `place` показывает все сеансы площадки. Возвращает экземпляр,
   * чтобы раздел снял iframe при размонтировании.
   */
  async function mountPlaceWidget(
    container: HTMLElement,
  ): Promise<AfishaWidgetInstance | undefined> {
    if (!placeId.value) return undefined

    const manager = await getManager()
    if (!manager) return undefined

    try {
      return await manager.appendWidget(
        { route: WIDGET_PLACE_ROUTE, embedType: 'inline', placeId: placeId.value },
        container,
      )
    } catch (error) {
      logWidgetError(error)

      return undefined
    }
  }

  return { openTicket, openPlaceSchedule, mountPlaceWidget }
}

function logWidgetError(error: unknown): void {
  if (import.meta.dev) {
    console.error('[useAfishaWidget]', error)
  }
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
