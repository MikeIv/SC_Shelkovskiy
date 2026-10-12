<script setup lang="ts">
import { useDemoData } from '~/composables/useDemoData'

/**
 * Плашка «данные из мока»: показывается, когда API не отдал контент и страница
 * подставила демо-данные из `~/data`. В статику не попадает — признак ставится
 * только на клиенте, после гидратации.
 *
 * Форма предупреждения временная: ждём решение дизайнера (блок или toast).
 */
const { active, notes } = useDemoData()

const sources = computed(() => notes.value.join(', '))
</script>

<template>
  <p
    v-if="active"
    :class="$style.root"
    role="status"
    aria-live="polite"
    data-demo-notice
    :title="sources ? `Демо-данные: ${sources}` : undefined"
  >
    <span :class="$style.dot" aria-hidden="true" />
    <span>Демо-данные</span>
  </p>
</template>

<style module lang="scss">
@use 'tools' as *;

/* Ниже шапки и слева: не перекрывает cookie-плашку и кнопки внизу экрана. */
.root {
  position: fixed;
  z-index: 20;
  top: rem(84);
  left: rem(16);
  display: inline-flex;
  gap: rem(8);
  align-items: center;
  padding: rem(6) rem(12);
  border-radius: rem(100);
  @include fs-text-sm;

  font-weight: 500;
  color: var(--fs-color-white);
  pointer-events: none;
  background-color: color-mix(in srgb, var(--fs-color-black) 82%, transparent);
  backdrop-filter: blur(rem(4));

  @include from-tablet {
    left: rem(24);
  }
}

.dot {
  width: rem(8);
  height: rem(8);
  border-radius: 50%;
  background-color: var(--fs-color-red);
}
</style>
