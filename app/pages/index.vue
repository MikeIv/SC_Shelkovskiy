<script setup lang="ts"></script>

<template>
  <div :class="$style.root">
    <h1>SC Shelkovskiy</h1>
    <p>
      Фронтенд Щёлковский: линтинг, стили, HTTP API (<code>useApi</code> /
      <code>useApiFetch</code>). Скопируйте <code>.env.example</code> в
      <code>.env</code>, задайте <code>NUXT_PUBLIC_API_BASE</code> при необходимости.
    </p>
  </div>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  padding: var(--fs-space-3);

  @include from-tablet {
    padding: var(--fs-space-4);
  }
}
</style>
