/**
 * Признак «часть контента — демо-данные»: API недоступен или не отдал раздел,
 * поэтому страница показывает мок из `~/data`.
 *
 * Состояние живёт только на клиенте и привязано к приложению Nuxt: данные сборки
 * приходят из payload и демо не считаются, а пререндер не должен вшивать плашку в статику.
 * Мокам без запроса (PDF-схема, кино, лояльность) признак не положен — это статика сайта.
 */
type DemoDataState = {
  /** Показывать ли предупреждение. */
  active: ComputedRef<boolean>
  /** Разделы-источники: ручка API или её ключ. */
  notes: Ref<string[]>
}

const states = new WeakMap<object, DemoDataState>()

/** Вызывать при подмене данных API демо-контентом; повторный вызов не дублирует источник. */
export function markDemoData(source: string): void {
  if (!import.meta.client) return

  const notes = demoState().notes

  if (!notes.value.includes(source)) notes.value = [...notes.value, source]
}

/** Снимать, когда запрос снова отдал данные: после `refresh` признак пропадает. */
export function unmarkDemoData(source: string): void {
  if (!import.meta.client) return

  const state = demoState()
  const notes = state.notes

  if (notes.value.includes(source)) notes.value = notes.value.filter((note) => note !== source)
}

/** Состояние для UI: плашка видна, пока есть хотя бы один источник демо-данных. */
export function useDemoData(): DemoDataState {
  return demoState()
}

function demoState(): DemoDataState {
  const nuxtApp = useNuxtApp()
  const cached = states.get(nuxtApp)

  if (cached) return cached

  const notes = ref<string[]>([])
  const state: DemoDataState = { active: computed(() => notes.value.length > 0), notes }
  states.set(nuxtApp, state)

  return state
}
