<script setup lang="ts">
import { useDemoData } from '~/composables/useDemoData'

/**
 * Плашка в углу: API не отдал контент, страница взяла мок из `~/data`.
 * На главной ярлык в секциях (`UiDemoDataBadge` + `useHome.demo`) — `/home` здесь
 * не дублируем (в т.ч. пометку `useApiData` для `/api/home`).
 */
const { notes } = useDemoData()

const pageNotes = computed(() => notes.value.filter((note) => !note.includes('/home')))
const show = computed(() => pageNotes.value.length > 0)
const sources = computed(() => pageNotes.value.join(', '))
</script>

<template>
  <UiDemoDataBadge
    v-if="show"
    :class="$style.root"
    data-demo-notice
    :title="sources ? `Демо-данные: ${sources}` : undefined"
  />
</template>

<style module lang="scss">
@use 'tools' as *;

/* Ниже шапки и слева: не перекрывает cookie-плашку и кнопки внизу экрана. */
.root {
  position: fixed;
  top: rem(84);
  left: rem(16);
  z-index: 20;

  @include from-tablet {
    left: rem(24);
  }
}
</style>
