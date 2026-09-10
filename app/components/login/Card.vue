<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    as?: 'form' | 'div'
    title: string
    titleLead?: string
    description?: string
    titleId: string
  }>(),
  {
    as: 'div',
    titleLead: '',
    description: '',
  },
)
</script>

<template>
  <component :is="as" :class="$style.root" v-bind="$attrs">
    <div :class="$style.header">
      <h1 :id="titleId" :class="$style.title">
        {{ title }}
        <span v-if="titleLead" :class="$style.titleLead">{{ titleLead }}</span>
      </h1>
      <p v-if="description || $slots.description" :class="$style.desc">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    <div v-if="$slots.fields" :class="$style.fields">
      <slot name="fields" />
    </div>
    <div v-if="$slots.actions" :class="$style.actions">
      <slot name="actions" />
    </div>
  </component>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  position: relative;
  z-index: z('default');
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-4);
  width: min(100%, #{rem(600)});
  padding: var(--fs-space-4);
  background-color: var(--fs-color-light);
  border-radius: rem(32);

  @include from-desktop {
    gap: var(--fs-space-5);
    padding: rem(56);
    border-radius: rem(60);
  }
}

.header {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  align-items: center;
  text-align: center;
}

.title {
  @include fs-h2;
  margin: 0;
  overflow-wrap: break-word;
}

.titleLead {
  display: block;
}

.desc {
  margin: 0;
  width: min(100%, #{rem(412)});
  @include fs-text;
  overflow-wrap: break-word;

  @include from-desktop {
    @include fs-text-lg;
  }
}

.fields,
.actions {
  display: flex;
  flex-direction: column;
  gap: var(--fs-space-2);
  width: 100%;
}

.actions {
  align-items: center;

  :deep([data-variant]) {
    width: 100%;
  }
}
</style>
