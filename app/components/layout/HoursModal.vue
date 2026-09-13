<script setup lang="ts">
const props = defineProps<{
  open: boolean
  anchor: HTMLElement | null
}>()

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

useDialogFocus({
  open: () => props.open,
  container: panelRef,
})

function close(): void {
  emit('close')
}

function updatePosition(): void {
  if (!import.meta.client || !props.anchor) {
    return
  }

  const rect = props.anchor.getBoundingClientRect()
  panelStyle.value = {
    top: `${Math.round(rect.bottom + 16)}px`,
    left: `${Math.round(rect.left)}px`,
  }
}

function onDocumentPointerDown(event: Event): void {
  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (panelRef.value?.contains(target) || props.anchor?.contains(target)) {
    return
  }

  close()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function bindListeners(bind: boolean): void {
  if (!import.meta.client) {
    return
  }

  if (bind) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    document.addEventListener('keydown', onKeydown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
}

watch(
  () => [props.open, props.anchor] as const,
  async ([isOpen]) => {
    if (!import.meta.client) {
      return
    }

    bindListeners(false)

    if (!isOpen) {
      return
    }

    updatePosition()
    bindListeners(true)
    await nextTick()
    updatePosition()
  },
)

onBeforeUnmount(() => {
  bindListeners(false)
})
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <LayoutPopupBackdrop @close="close" />
      <div
        ref="panelRef"
        :class="$style.panel"
        :style="panelStyle"
        role="dialog"
        aria-modal="true"
        aria-label="Время работы"
      >
        <LayoutHoursPanel />
      </div>
    </template>
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.panel {
  position: fixed;
  z-index: z('dropdown-panel');
  display: flex;
  flex-direction: column;
  width: min(100% - var(--fs-grid-margin) * 2, #{rem(515)});
  max-height: calc(100vh - #{rem(24)});
  overflow: auto;
}
</style>
