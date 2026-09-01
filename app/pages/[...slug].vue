<script setup lang="ts">
setResponseStatus(404)
</script>

<template>
  <LayoutInnerPage title="Страница не найдена">
    <p :class="$style.text">
      Запрашиваемая страница не существует.
    </p>
  </LayoutInnerPage>
</template>

<style module lang="scss">
@use 'tools' as *;

.text {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}
</style>
