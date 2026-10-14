<script setup lang="ts">
const { items, dismiss } = useUiToast()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="items.length"
      :class="$style.host"
      aria-label="Уведомления"
    >
      <UiToast
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :variant="item.variant"
        :action="item.action"
        @close="dismiss(item.id)"
      />
    </div>
  </Teleport>
</template>

<style module lang="scss">
@use 'tools' as *;

.host {
  position: fixed;
  inset-inline: var(--fs-space-2);
  bottom: var(--fs-space-2);
  z-index: z('toast');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: stretch;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  @include from-desktop {
    inset-inline: auto rem(40);
    bottom: rem(40);
    gap: var(--fs-space-3);
    align-items: flex-end;
  }
}
</style>
