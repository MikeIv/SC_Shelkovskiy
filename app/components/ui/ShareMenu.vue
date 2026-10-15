<script setup lang="ts">
import { getShareNetworkUrl, type ShareNetwork } from '~/utils/shareLinks'

type ShareAction = ShareNetwork | 'copy'

interface ShareMenuItem {
  readonly id: ShareAction
  readonly label: string
  readonly icon: `local:${string}`
}

const items = [
  { id: 'max', label: 'Max', icon: 'local:social-max' },
  { id: 'vk', label: 'Вконтакте', icon: 'local:social-vk' },
  { id: 'ok', label: 'Одноклассники', icon: 'local:odnoklassniki' },
  { id: 'copy', label: 'Скопировать ссылку', icon: 'local:copy' },
] as const satisfies readonly ShareMenuItem[]

const PANEL_WIDTH_PX = 268
const PANEL_OFFSET_PX = 16
const PANEL_EDGE_PX = 8

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const menuId = useId()
const panelStyle = ref<{ top: string; left: string }>({ top: '0', left: '0' })

function pageUrl(): string {
  return window.location.href
}

function close(): void {
  isOpen.value = false
}

function toggle(): void {
  isOpen.value = !isOpen.value
}

function updatePanelPosition(): void {
  const trigger = rootRef.value
  if (!trigger) {
    return
  }

  const rect = trigger.getBoundingClientRect()
  const maxLeft = window.innerWidth - PANEL_WIDTH_PX - PANEL_EDGE_PX
  const left = Math.round(Math.min(Math.max(PANEL_EDGE_PX, rect.left), maxLeft))

  panelStyle.value = {
    top: `${Math.round(rect.bottom + PANEL_OFFSET_PX)}px`,
    left: `${left}px`,
  }
}

function onDocumentPointerDown(event: Event): void {
  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }

  close()
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function bindDocumentListeners(bind: boolean): void {
  if (!import.meta.client) {
    return
  }

  if (bind) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    document.addEventListener('keydown', onDocumentKeydown, true)
    window.addEventListener('scroll', updatePanelPosition, true)
    window.addEventListener('resize', updatePanelPosition)
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onDocumentKeydown, true)
  window.removeEventListener('scroll', updatePanelPosition, true)
  window.removeEventListener('resize', updatePanelPosition)
}

watch(isOpen, async (open) => {
  bindDocumentListeners(open)

  if (open) {
    await nextTick()
    updatePanelPosition()
  }
})

async function onSelect(action: ShareAction): Promise<void> {
  if (action === 'copy') {
    try {
      await navigator.clipboard.writeText(pageUrl())
    } catch {
      // Clipboard API недоступен.
    }
    close()
    return
  }

  window.open(getShareNetworkUrl(action, pageUrl()), '_blank', 'noopener,noreferrer')
  close()
}

onBeforeUnmount(() => {
  bindDocumentListeners(false)
})
</script>

<template>
  <div ref="rootRef" :class="$style.root">
    <button
      type="button"
      :class="$style.trigger"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      :aria-controls="isOpen ? menuId : undefined"
      @click="toggle"
    >
      <UIcon name="local:share" :class="$style.triggerIcon" aria-hidden="true" />
      <span>Поделиться</span>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        :id="menuId"
        ref="panelRef"
        :class="$style.panel"
        :style="panelStyle"
        role="menu"
        aria-label="Поделиться"
      >
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          :class="$style.item"
          role="menuitem"
          @click="onSelect(item.id)"
        >
          <UIcon :name="item.icon" :class="$style.itemIcon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  width: fit-content;
}

.trigger {
  display: inline-flex;
  gap: var(--fs-space-1);
  align-items: center;
  width: fit-content;
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-md;
  color: var(--fs-color-black);
  background: transparent;
  cursor: pointer;
  appearance: none;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--fs-color-gray);
    }
  }
}

.triggerIcon {
  flex-shrink: 0;
  width: rem(24);
  height: rem(24);
}

.panel {
  position: fixed;
  z-index: z('dropdown-panel');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: rem(268);
  padding: var(--fs-space-3);
  border-radius: var(--fs-radius-xl);
  background-color: var(--fs-color-light);
  overflow: clip;
}

.item {
  display: flex;
  gap: var(--fs-space-1);
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  @include fs-text-md;
  color: var(--fs-color-gray);
  text-align: start;
  white-space: nowrap;
  background: transparent;
  cursor: pointer;
  appearance: none;
  transition: color 0.15s ease;

  &:focus-visible {
    outline: rem(2) solid var(--fs-color-black);
    outline-offset: rem(2);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--fs-color-black);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.itemIcon {
  flex-shrink: 0;
  width: var(--fs-space-4);
  height: var(--fs-space-4);
  color: inherit;
}
</style>
