<script setup lang="ts">
const { title, description, iconSrc, tone } = defineProps<{
  title: string
  description: string
  iconSrc: string
  tone: 'light' | 'beige'
}>()
</script>

<template>
  <article
    :class="[
      $style.root,
      tone === 'light' ? $style.toneLight : $style.toneBeige,
    ]"
  >
    <div :class="$style.iconWrap">
      <img
        :class="$style.icon"
        :src="iconSrc"
        alt=""
        width="32"
        height="32"
        decoding="async"
      >
    </div>

    <div :class="$style.copy">
      <h3 :class="$style.title">{{ title }}</h3>
      <p :class="$style.desc">{{ description }}</p>
    </div>
  </article>
</template>

<style module lang="scss">
@use 'tools' as *;

.root {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: var(--fs-space-2);
  width: rem(304);
  padding: var(--fs-space-2);
  border-radius: var(--fs-radius-2xl);

  @include from-tablet {
    flex: 325 1 0;
    width: auto;
    min-width: 0;
  }

  @include from-desktop {
    flex-direction: row;
    flex-grow: 635;
    gap: var(--fs-space-3);
    align-items: center;
    padding: var(--fs-space-3);
  }
}

.toneLight {
  background-color: var(--fs-color-light);

  @include from-tablet {
    flex-grow: 388;
  }

  @include from-desktop {
    flex-grow: 900;
  }
}

.toneBeige {
  background-color: var(--fs-color-beige);
}

.iconWrap {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: rem(60);
  height: rem(68);
  border-radius: var(--fs-radius-pill);
  background-color: var(--fs-color-white);

  @include from-desktop {
    width: rem(92);
    height: rem(103);
  }
}

.icon {
  display: block;
  width: rem(32);
  height: rem(32);
}

.copy {
  display: flex;
  flex-direction: column;
  gap: rem(12);
  min-width: 0;
}

.title {
  @include fs-h3;
  margin: 0;
  overflow-wrap: break-word;
}

.desc {
  margin: 0;
  overflow-wrap: break-word;

  @include fs-text-lg;
}
</style>
