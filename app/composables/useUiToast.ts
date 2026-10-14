export type UiToastVariant = 'error' | 'warning' | 'success'

export type UiToastAction = {
  readonly label: string
  readonly href?: string
  readonly to?: string
  readonly onClick?: () => void
}

export type UiToastInput = {
  readonly title: string
  readonly description?: string
  readonly variant?: UiToastVariant
  readonly action?: UiToastAction
  /** Автозакрытие в мс; `0` — только вручную. По умолчанию: success 5000, иначе 0. */
  readonly duration?: number
}

export type UiToastItem = {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly variant: UiToastVariant
  readonly action?: UiToastAction
}

type ToastState = {
  readonly items: Ref<UiToastItem[]>
  readonly timers: Map<string, ReturnType<typeof setTimeout>>
}

const states = new WeakMap<object, ToastState>()
let toastSeq = 0

function toastState(): ToastState {
  const nuxtApp = useNuxtApp()
  const cached = states.get(nuxtApp)

  if (cached) return cached

  const state: ToastState = {
    items: ref([]),
    timers: new Map(),
  }
  states.set(nuxtApp, state)

  return state
}

function clearTimer(state: ToastState, id: string): void {
  const timer = state.timers.get(id)
  if (!timer) return
  clearTimeout(timer)
  state.timers.delete(id)
}

/**
 * Очередь UI-toast проекта.
 * Не путать с `useToast` из `@nuxt/ui`.
 * Хост: `UiToastHost` в layout.
 */
export function useUiToast() {
  const state = toastState()

  function dismiss(id: string): void {
    clearTimer(state, id)
    state.items.value = state.items.value.filter((item) => item.id !== id)
  }

  function clear(): void {
    for (const timer of state.timers.values()) {
      clearTimeout(timer)
    }
    state.timers.clear()
    state.items.value = []
  }

  function show(input: UiToastInput): string {
    const id = `toast-${++toastSeq}`
    const variant = input.variant ?? 'error'
    const duration = input.duration ?? (variant === 'success' ? 5000 : 0)

    state.items.value = [
      ...state.items.value,
      {
        id,
        title: input.title,
        description: input.description,
        variant,
        action: input.action,
      },
    ]

    if (import.meta.client && duration > 0) {
      state.timers.set(
        id,
        setTimeout(() => {
          dismiss(id)
        }, duration),
      )
    }

    return id
  }

  return {
    items: readonly(state.items),
    show,
    dismiss,
    clear,
    error: (input: Omit<UiToastInput, 'variant'>) => show({ ...input, variant: 'error' }),
    warning: (input: Omit<UiToastInput, 'variant'>) => show({ ...input, variant: 'warning' }),
    success: (input: Omit<UiToastInput, 'variant'>) => show({ ...input, variant: 'success' }),
  }
}
