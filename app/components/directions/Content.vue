<script setup lang="ts">
import type {
  DirectionsMode,
  DirectionsPageContent,
} from '#shared/types/directions'

const props = defineProps<{
  content: DirectionsPageContent
}>()

const activeMode = ref<DirectionsMode>(props.content.tabs[0]?.id ?? 'car')

const activeTab = computed(() => {
  const tabs = props.content.tabs
  return tabs.find((tab) => tab.id === activeMode.value) ?? tabs[0]!
})

const routeHref = computed(() => {
  const [lng, lat] = props.content.place.coordinates
  return `https://yandex.ru/maps/?rtext=~${lat},${lng}&rtt=${activeTab.value.yandexRtt}`
})
</script>

<template>
  <section :class="$style.root" aria-labelledby="directions-title">
    <div :class="$style.lead">
      <h1 id="directions-title" :class="$style.title">
        {{ content.title }}
      </h1>

      <div :class="$style.tabs" aria-label="Способ проезда">
        <UiTab
          v-for="tab in content.tabs"
          :key="tab.id"
          :selected="activeMode === tab.id"
          @click="activeMode = tab.id"
        >
          {{ tab.label }}
        </UiTab>
      </div>
    </div>

    <DirectionsMap
      :place="content.place"
      :map-alt="content.mapAlt"
      :route-href="routeHref"
      :route-phrase="activeTab.routePhrase"
    />
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include from-desktop {
    gap: var(--fs-space-5);
  }
}

.lead {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-3);
  min-width: 0;

  @include from-desktop {
    gap: rem(40);
  }
}

.title {
  @include fs-h1;
  margin: 0;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: rem(8);
  align-items: center;

  @include from-desktop {
    gap: 0;
  }
}
</style>
