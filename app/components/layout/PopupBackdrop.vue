<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div
    :class="$style.backdrop"
    aria-hidden="true"
    @click="emit('close')"
  />
</template>

<style module lang="scss">
@use 'tools' as *;

.backdrop {
  position: fixed;
  inset: 0;
  z-index: z('dropdown');
  background-color: color-mix(in srgb, var(--fs-color-black) 40%, transparent);
}
</style>
