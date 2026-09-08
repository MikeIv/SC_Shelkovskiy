<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => (isNotFound.value ? 'Страница не найдена' : 'Ошибка'),
})

const handleHome = async () => {
  await clearError({ redirect: '/' })
}
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <ErrorNotFound v-if="isNotFound" />
      <section v-else :class="$style.fallback">
        <h1 :class="$style.fallbackTitle">
          {{ error.statusCode ?? 'Ошибка' }}
        </h1>
        <p v-if="error.statusMessage" :class="$style.fallbackText">
          {{ error.statusMessage }}
        </p>
        <UiButton type="button" @click="handleHome">На главную</UiButton>
      </section>
    </NuxtLayout>
  </UApp>
</template>

<style module lang="scss">
@use 'tools' as *;

.fallback {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  align-items: flex-start;
  padding-block: var(--fs-space-5);
  padding-inline: max(
    var(--fs-grid-margin),
    calc((100% - var(--fs-grid-content-max)) / 2)
  );

  @include from-desktop {
    gap: var(--fs-space-4);
    padding-block: var(--fs-space-6);
  }
}

.fallbackTitle {
  @include fs-h1;
  margin: 0;
}

.fallbackText {
  margin: 0;
  @include fs-text-lg;
  color: var(--fs-color-gray);
}
</style>
