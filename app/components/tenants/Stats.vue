<script setup lang="ts">
import type { TenantsStat } from '#shared/types/tenants'

const { title, description, items } = defineProps<{
  title: string
  description: string
  items: TenantsStat[]
}>()
</script>

<template>
  <section :class="$style.root" aria-labelledby="tenants-stats-title">
    <div :class="$style.head">
      <h2 id="tenants-stats-title" :class="$style.title">
        {{ title }}
      </h2>
      <p :class="$style.desc">
        {{ description }}
      </p>
    </div>

    <ul :class="$style.list">
      <li
        v-for="item in items"
        :key="item.id"
        :class="$style.item"
      >
        <p :class="$style.value">
          {{ item.value }}
        </p>
        <p :class="$style.label">
          {{ item.label }}
        </p>
      </li>
    </ul>
  </section>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  align-items: center;

  @include from-desktop {
    gap: rem(40);
  }
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: center;
  max-width: rem(882);
  text-align: center;

  @include from-desktop {
    gap: var(--fs-space-3);
  }
}

.title {
  @include fs-h1;
  margin: 0;
  overflow-wrap: break-word;
}

.desc {
  margin: 0;
  @include fs-text-lg;
  overflow-wrap: break-word;
}

.list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--fs-space-4);
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: center;

  @include from-tablet {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--fs-space-5);
  }

  @include from-desktop {
    gap: rem(56);
  }
}

.item {
  display: flex;
  flex-direction: column;
  gap: rem(8);
  min-width: 0;
}

.value {
  @include fs-h2;
  margin: 0;
}

.label {
  margin: 0;
  @include fs-text-lg;
}
</style>
