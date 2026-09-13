const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function isVisible(el: HTMLElement): boolean {
  return el.getClientRects().length > 0
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible)
}

/**
 * Возврат фокуса на триггер + цикл Tab внутри контейнера (паттерн Lightbox/FeedbackModal).
 * `trap: false` — десктопный dropdown: фокус при открытии, без ловушки Tab.
 */
export function useDialogFocus(options: {
  open: Ref<boolean> | (() => boolean)
  container: Ref<HTMLElement | null>
  /** Куда поставить фокус при открытии; иначе — первый focusable в контейнере. */
  initialFocus?: Ref<HTMLElement | null>
  /** По умолчанию true. false — не перехватывать Tab (немодальная панель). */
  trap?: Ref<boolean> | (() => boolean)
}) {
  let previousFocus: HTMLElement | null = null

  function isOpen(): boolean {
    return typeof options.open === 'function' ? options.open() : options.open.value
  }

  function shouldTrap(): boolean {
    if (options.trap === undefined) {
      return true
    }

    return typeof options.trap === 'function' ? options.trap() : options.trap.value
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !options.container.value || !shouldTrap()) {
      return
    }

    const focusable = getFocusable(options.container.value)
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey) {
      if (active === first || !options.container.value.contains(active)) {
        event.preventDefault()
        last?.focus()
      }
      return
    }

    if (active === last || !options.container.value.contains(active)) {
      event.preventDefault()
      first?.focus()
    }
  }

  function bindTrap(bind: boolean) {
    if (!import.meta.client) {
      return
    }

    document.removeEventListener('keydown', onKeydown, true)

    if (bind) {
      // Слушатель всегда; shouldTrap() проверяется на каждый Tab (desktop dropdown ↔ mobile modal).
      document.addEventListener('keydown', onKeydown, true)
    }
  }

  async function activate() {
    if (!import.meta.client) {
      return
    }

    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    bindTrap(true)
    await nextTick()

    // Teleport + v-if: контейнер появляется на следующем тике.
    if (!options.container.value) {
      await nextTick()
    }

    const preferred = options.initialFocus?.value
    if (preferred) {
      preferred.focus()
      return
    }

    const first = options.container.value ? getFocusable(options.container.value)[0] : undefined
    first?.focus()
  }

  function deactivate() {
    if (!import.meta.client) {
      return
    }

    bindTrap(false)
    previousFocus?.focus()
    previousFocus = null
  }

  watch(
    () => isOpen(),
    (open) => {
      if (open) {
        void activate()
        return
      }

      deactivate()
    },
  )

  onBeforeUnmount(() => {
    bindTrap(false)
  })

  return { activate, deactivate }
}
